import json
import tempfile
import unittest
from pathlib import Path

from server import create_app


class AuthAndProgressTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        database = Path(self.temp_dir.name) / "test.sqlite3"
        self.app = create_app(database)
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_register_persists_progress_and_quiz_result(self):
        response = self.client.post("/api/auth/register", json={
            "name": "متدرب تجريبي",
            "email": "learner@example.com",
            "password": "SafePass123",
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["user"]["email"], "learner@example.com")
        self.assertIn("HttpOnly", response.headers.get("Set-Cookie", ""))
        self.assertNotIn("Secure", response.headers.get("Set-Cookie", ""))

        progress = self.client.put("/api/progress", json={"completedUnitIds": [1, 3, 1]})
        self.assertEqual(progress.status_code, 200)
        self.assertEqual(progress.json["completedUnitIds"], [1, 3])

        result = self.client.post("/api/quiz-results", json={"score": 24, "total": 30})
        self.assertEqual(result.status_code, 201)
        self.assertEqual(result.json["percentage"], 80)

        self.client.post("/api/auth/logout")
        anonymous = self.client.get("/api/auth/me")
        self.assertIsNone(anonymous.json["user"])

        login = self.client.post("/api/auth/login", json={"email": "learner@example.com", "password": "SafePass123"})
        self.assertEqual(login.status_code, 200)
        self.assertEqual(login.json["completedUnitIds"], [1, 3])
        self.assertEqual(login.json["latestQuiz"]["percentage"], 80)

    def test_invalid_registration_and_unauthenticated_progress_are_rejected(self):
        invalid = self.client.post("/api/auth/register", json={"name": "A", "email": "bad", "password": "123"})
        self.assertEqual(invalid.status_code, 400)
        denied = self.client.put("/api/progress", json={"completedUnitIds": [1]})
        self.assertEqual(denied.status_code, 401)

    def test_duplicate_account_and_wrong_password(self):
        payload = {"name": "متدرب", "email": "same@example.com", "password": "SafePass123"}
        self.assertEqual(self.client.post("/api/auth/register", json=payload).status_code, 201)
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.post("/api/auth/register", json=payload).status_code, 409)
        self.assertEqual(self.client.post("/api/auth/login", json={"email": payload["email"], "password": "wrongpass"}).status_code, 401)


if __name__ == "__main__":
    unittest.main()
