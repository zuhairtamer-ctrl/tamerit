from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, g, jsonify, request

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = Path(os.environ.get("APP_DB_PATH", BASE_DIR / "data" / "learning.sqlite3"))
SESSION_COOKIE = "vtc_session"
SESSION_TTL_SECONDS = 60 * 60 * 24 * 14
PASSWORD_ITERATIONS = 390_000
COURSE_ID = "digital-skills"
COURSE_UNIT_COUNT = 10
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def create_app(database_path: str | Path | None = None) -> Flask:
    app = Flask(__name__)
    app.config["DATABASE"] = str(database_path or DATABASE_PATH)
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
    Path(app.config["DATABASE"]).parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(app.config["DATABASE"]) as db:
        db.execute("PRAGMA foreign_keys = ON")
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires_at INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
            CREATE TABLE IF NOT EXISTS course_progress (
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                course_id TEXT NOT NULL,
                completed_unit_ids TEXT NOT NULL DEFAULT '[]',
                updated_at TEXT NOT NULL,
                PRIMARY KEY (user_id, course_id)
            );
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                course_id TEXT NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                percentage INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS quiz_results_latest_idx ON quiz_results(user_id, course_id, id DESC);
            """
        )
        db.execute("DELETE FROM sessions WHERE expires_at <= ?", (int(time.time()),))

    @app.before_request
    def open_database() -> None:
        if "db" not in g:
            db = sqlite3.connect(app.config["DATABASE"], timeout=15)
            db.row_factory = sqlite3.Row
            db.execute("PRAGMA foreign_keys = ON")
            g.db = db

    @app.teardown_appcontext
    def close_database(_error: BaseException | None = None) -> None:
        db = g.pop("db", None)
        if db is not None:
            db.close()

    @app.errorhandler(413)
    def request_too_large(_error: Any):
        return jsonify(error="حجم الطلب أكبر من المسموح."), 413

    def current_user() -> sqlite3.Row | None:
        raw_token = request.cookies.get(SESSION_COOKIE)
        if not raw_token:
            return None
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        row = g.db.execute(
            """SELECT users.id, users.name, users.email, sessions.expires_at
               FROM sessions JOIN users ON users.id = sessions.user_id
               WHERE sessions.token_hash = ?""",
            (token_hash,),
        ).fetchone()
        if row is None:
            return None
        if row["expires_at"] <= int(time.time()):
            g.db.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash,))
            g.db.commit()
            return None
        return row

    def session_payload(user_id: int) -> dict[str, Any]:
        progress = g.db.execute(
            "SELECT completed_unit_ids FROM course_progress WHERE user_id = ? AND course_id = ?",
            (user_id, COURSE_ID),
        ).fetchone()
        try:
            completed_ids = json.loads(progress["completed_unit_ids"]) if progress else []
        except (TypeError, json.JSONDecodeError):
            completed_ids = []
        latest = g.db.execute(
            """SELECT score, total, percentage, created_at FROM quiz_results
               WHERE user_id = ? AND course_id = ? ORDER BY id DESC LIMIT 1""",
            (user_id, COURSE_ID),
        ).fetchone()
        return {
            "completedUnitIds": completed_ids,
            "latestQuiz": dict(latest) if latest else None,
        }

    def auth_response(user: sqlite3.Row, status: int = 200):
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        expires_at = int(time.time()) + SESSION_TTL_SECONDS
        g.db.execute(
            "INSERT INTO sessions(token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
            (token_hash, user["id"], expires_at, utc_now()),
        )
        g.db.commit()
        response = jsonify(
            user={"id": user["id"], "name": user["name"], "email": user["email"]},
            **session_payload(user["id"]),
        )
        forwarded_proto = request.headers.get("X-Forwarded-Proto", "").split(",")[0].strip().lower()
        response.set_cookie(
            SESSION_COOKIE,
            raw_token,
            max_age=SESSION_TTL_SECONDS,
            httponly=True,
            secure=(forwarded_proto == "https" or request.is_secure),
            samesite="Lax",
            path="/",
        )
        return response, status

    @app.get("/api/health")
    def health():
        return jsonify(status="ok")

    @app.get("/api/auth/me")
    def get_me():
        user = current_user()
        if user is None:
            return jsonify(user=None, completedUnitIds=[], latestQuiz=None)
        return jsonify(
            user={"id": user["id"], "name": user["name"], "email": user["email"]},
            **session_payload(user["id"]),
        )

    @app.post("/api/auth/register")
    def register():
        data = request.get_json(silent=True) or {}
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = data.get("password", "")
        if len(name) < 2 or len(name) > 80:
            return jsonify(error="اكتب اسمًا من حرفين إلى 80 حرفًا."), 400
        if len(email) > 254 or not EMAIL_RE.match(email):
            return jsonify(error="تحقق من صحة البريد الإلكتروني."), 400
        if not isinstance(password, str) or len(password) < 8 or len(password) > 128:
            return jsonify(error="كلمة المرور يجب أن تتكون من 8 أحرف على الأقل."), 400
        salt = secrets.token_bytes(16)
        password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS).hex()
        try:
            cursor = g.db.execute(
                "INSERT INTO users(name, email, password_salt, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                (name, email, salt.hex(), password_hash, utc_now()),
            )
            g.db.commit()
        except sqlite3.IntegrityError:
            g.db.rollback()
            return jsonify(error="يوجد حساب مسجل بهذا البريد الإلكتروني."), 409
        user = g.db.execute("SELECT id, name, email FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return auth_response(user, 201)

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        email = str(data.get("email", "")).strip().lower()
        password = data.get("password", "")
        user = g.db.execute(
            "SELECT id, name, email, password_salt, password_hash FROM users WHERE email = ?",
            (email,),
        ).fetchone()
        valid = False
        if user is not None and isinstance(password, str):
            candidate = hashlib.pbkdf2_hmac(
                "sha256", password.encode("utf-8"), bytes.fromhex(user["password_salt"]), PASSWORD_ITERATIONS
            ).hex()
            valid = hmac.compare_digest(candidate, user["password_hash"])
        if not valid:
            return jsonify(error="البريد الإلكتروني أو كلمة المرور غير صحيحة."), 401
        return auth_response(user)

    @app.post("/api/auth/logout")
    def logout():
        raw_token = request.cookies.get(SESSION_COOKIE)
        if raw_token:
            token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
            g.db.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash,))
            g.db.commit()
        response = jsonify(ok=True)
        response.delete_cookie(SESSION_COOKIE, path="/", httponly=True, samesite="Lax")
        return response

    @app.put("/api/progress")
    def update_progress():
        user = current_user()
        if user is None:
            return jsonify(error="سجّل الدخول لحفظ تقدمك."), 401
        data = request.get_json(silent=True) or {}
        ids = data.get("completedUnitIds")
        if not isinstance(ids, list) or any(isinstance(item, bool) or not isinstance(item, int) for item in ids):
            return jsonify(error="قائمة الوحدات المكتملة غير صالحة."), 400
        if any(item < 1 or item > COURSE_UNIT_COUNT for item in ids):
            return jsonify(error="تتضمن القائمة رقم وحدة غير معروف."), 400
        clean_ids = sorted(set(ids))
        g.db.execute(
            """INSERT INTO course_progress(user_id, course_id, completed_unit_ids, updated_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(user_id, course_id) DO UPDATE SET
                 completed_unit_ids = excluded.completed_unit_ids,
                 updated_at = excluded.updated_at""",
            (user["id"], COURSE_ID, json.dumps(clean_ids), utc_now()),
        )
        g.db.commit()
        return jsonify(completedUnitIds=clean_ids)

    @app.post("/api/quiz-results")
    def save_quiz_result():
        user = current_user()
        if user is None:
            return jsonify(error="سجّل الدخول لحفظ نتيجة التقييم."), 401
        data = request.get_json(silent=True) or {}
        score, total = data.get("score"), data.get("total")
        if (
            isinstance(score, bool)
            or isinstance(total, bool)
            or not isinstance(score, int)
            or not isinstance(total, int)
            or total < 1
            or score < 0
            or score > total
            or total > 100
        ):
            return jsonify(error="نتيجة الاختبار غير صالحة."), 400
        percentage = round(score * 100 / total)
        g.db.execute(
            "INSERT INTO quiz_results(user_id, course_id, score, total, percentage, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user["id"], COURSE_ID, score, total, percentage, utc_now()),
        )
        g.db.commit()
        return jsonify(score=score, total=total, percentage=percentage), 201

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("API_PORT", "8000")), debug=False, threaded=True)
