import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const python = process.env.PYTHON || 'python3';
const api = spawn(python, ['server.py'], { cwd: projectDir, stdio: 'inherit', env: process.env });
let vite;
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  api.kill('SIGTERM');
  vite?.kill('SIGTERM');
  setTimeout(() => process.exit(code), 250).unref();
}

api.on('error', (error) => {
  console.error(`تعذر تشغيل خادم الحسابات: ${error.message}`);
  stop(1);
});
api.on('exit', (code) => {
  if (!stopping && code !== 0) {
    console.error(`توقف خادم الحسابات برمز ${code ?? 'غير معروف'}.`);
    stop(code || 1);
  }
});

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

let ready = false;
for (let attempt = 0; attempt < 40 && !stopping; attempt += 1) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/health');
    if (response.ok) {
      ready = true;
      break;
    }
  } catch {
    await delay(250);
  }
}

if (!ready) {
  console.error('لم يبدأ خادم الحسابات على المنفذ 8000؛ أوقفت التشغيل لتجنب واجهة غير مكتملة.');
  stop(1);
} else {
  console.log('خادم الحسابات وقاعدة البيانات جاهزان.');
  vite = spawn(process.execPath, [resolve(projectDir, 'node_modules/vite/bin/vite.js'), '--host', '0.0.0.0', '--port', '5173', '--strictPort'], {
    cwd: projectDir,
    stdio: 'inherit',
    env: process.env,
  });
  vite.on('error', (error) => {
    console.error(`تعذر تشغيل واجهة Vite: ${error.message}`);
    stop(1);
  });
  vite.on('exit', (code) => stop(code ?? 0));
}
