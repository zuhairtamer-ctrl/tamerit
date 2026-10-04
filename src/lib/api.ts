export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface QuizSummary {
  score: number;
  total: number;
  percentage: number;
  created_at: string;
}

export interface AuthSession {
  user: AuthUser | null;
  completedUnitIds: number[];
  latestQuiz: QuizSummary | null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || 'تعذر إكمال الطلب. حاول مرة أخرى.');
  }
  return body as T;
}

export function getSession() {
  return request<AuthSession>('/auth/me');
}

export function registerAccount(input: { name: string; email: string; password: string }) {
  return request<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify(input) });
}

export function loginAccount(input: { email: string; password: string }) {
  return request<AuthSession>('/auth/login', { method: 'POST', body: JSON.stringify(input) });
}

export function logoutAccount() {
  return request<{ ok: boolean }>('/auth/logout', { method: 'POST' });
}

export function saveProgress(completedUnitIds: number[]) {
  return request<{ completedUnitIds: number[] }>('/progress', {
    method: 'PUT',
    body: JSON.stringify({ completedUnitIds }),
  });
}

export function saveQuizResult(score: number, total: number) {
  return request<{ score: number; total: number; percentage: number }>('/quiz-results', {
    method: 'POST',
    body: JSON.stringify({ score, total }),
  });
}
