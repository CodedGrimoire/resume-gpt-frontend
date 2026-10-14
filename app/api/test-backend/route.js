import { NextResponse } from 'next/server';

/** Read-only backend readiness check. It does not run or warm up Groq analysis. */
export async function GET() {
  const requestId = globalThis.crypto?.randomUUID?.() || `health-${Date.now()}`;
  const startedAt = Date.now();
  const configuredBackend = process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3003'
      : 'https://resume-gpt-backend-7s7f.onrender.com');
  const backendUrl = configuredBackend.replace(/\/+$/, '');

  console.info('[ResumeGPT backend health]', JSON.stringify({ event: 'backend.healthcheck.started', requestId, backendHost: new URL(backendUrl).host }));
  try {
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json', 'X-Request-Id': requestId },
      signal: AbortSignal.timeout(8_000),
    });
    const contentType = response.headers.get('content-type') || '';
    const health = contentType.includes('application/json') ? await response.json() : null;
    console.info('[ResumeGPT backend health]', JSON.stringify({ event: 'backend.healthcheck.completed', requestId, status: response.status, elapsedMs: Date.now() - startedAt }));

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      backendHost: new URL(backendUrl).host,
      requestId,
      health,
      message: response.ok ? 'Backend is reachable.' : `Backend returned ${response.status}.`,
    }, { status: response.ok ? 200 : 502 });
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    console.error('[ResumeGPT backend health]', JSON.stringify({ event: 'backend.healthcheck.failed', requestId, errorName: error?.name || 'Error', message: String(error?.message || '').slice(0, 200), elapsedMs: Date.now() - startedAt }));
    return NextResponse.json({
      success: false,
      error: timedOut ? 'Health check timed out.' : 'Health check could not reach the backend.',
      requestId,
    }, { status: timedOut ? 504 : 502 });
  }
}
