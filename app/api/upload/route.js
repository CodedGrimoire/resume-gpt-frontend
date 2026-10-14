import { NextResponse } from 'next/server';

// Current Vercel Hobby and Pro limits support up to 300 seconds (plan/config applies).
export const maxDuration = 300;

const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 270_000;

function getRequestId(request) {
  const candidate = request.headers.get('x-request-id') || '';
  return /^[A-Za-z0-9-]{1,80}$/.test(candidate)
    ? candidate
    : globalThis.crypto?.randomUUID?.() || `proxy-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function log(event, details = {}) {
  console.info('[ResumeGPT upload proxy]', JSON.stringify({ event, ...details }));
}

function jsonResponse(body, status, requestId) {
  return NextResponse.json({ ...body, requestId }, {
    status,
    headers: { 'X-Request-Id': requestId },
  });
}

export async function POST(request) {
  const requestId = getRequestId(request);
  const startedAt = Date.now();
  log('proxy.request.received', { requestId, method: request.method });

  try {
    const formData = await request.formData();
    const resume = formData.get('resume');
    if (!(resume instanceof Blob)) {
      log('proxy.file.validation.failed', { requestId, reason: 'missing_resume_field' });
      return jsonResponse({ error: 'No PDF file was received. Please select a PDF and try again.' }, 400, requestId);
    }
    if (resume.size > MAX_RESUME_BYTES) {
      log('proxy.file.validation.failed', { requestId, reason: 'file_too_large', bytes: resume.size });
      return jsonResponse({ error: 'This PDF is too large for Vercel upload. Choose a PDF smaller than 4 MB.' }, 413, requestId);
    }
    if (resume.type !== 'application/pdf') {
      log('proxy.file.validation.failed', { requestId, reason: 'invalid_mime_type', mimeType: resume.type || 'unknown' });
      return jsonResponse({ error: 'Please choose a valid PDF file.' }, 400, requestId);
    }
    log('proxy.file.received', { requestId, bytes: resume.size, mimeType: resume.type });

    const configuredBackend = process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3003'
        : 'https://resume-gpt-backend-7s7f.onrender.com');
    const backendUrl = configuredBackend.replace(/\/+$/, '');
    const uploadUrl = `${backendUrl}/upload`;
    const backendHost = new URL(backendUrl).host;
    log('proxy.upload.forwarding', { requestId, backendHost, endpoint: '/upload', formField: 'resume' });

    const upstreamStartedAt = Date.now();
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'X-Request-Id': requestId },
      body: formData,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    log('proxy.backend.response', {
      requestId,
      status: response.status,
      ok: response.ok,
      elapsedMs: Date.now() - upstreamStartedAt,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      log('proxy.backend.invalid_response', { requestId, status: response.status, contentType: contentType || 'unknown' });
      return jsonResponse({ error: response.ok
        ? 'The analysis service returned an unexpected response.'
        : `The analysis service returned HTTP ${response.status}. Please try again later.` }, response.ok ? 502 : response.status, requestId);
    }

    const data = await response.json();
    if (!response.ok) {
      const error = data.error || data.message || `Analysis service returned HTTP ${response.status}.`;
      log('proxy.backend.request_failed', { requestId, status: response.status, error: String(error).slice(0, 200) });
      return jsonResponse({ error }, response.status, requestId);
    }

    log('proxy.upload.completed', { requestId, elapsedMs: Date.now() - startedAt });
    return jsonResponse(data, 200, requestId);
  } catch (error) {
    const timedOut = error?.name === 'AbortError' || error?.name === 'TimeoutError';
    log('proxy.upload.failed', {
      requestId,
      errorName: error?.name || 'Error',
      message: String(error?.message || 'Unknown error').slice(0, 200),
      elapsedMs: Date.now() - startedAt,
    });
    return jsonResponse({
      error: timedOut
        ? 'The analysis service took too long to respond. Please retry; if it repeats, share the reference ID.'
        : 'The analysis service could not be reached. Please retry; if it repeats, share the reference ID.',
    }, timedOut ? 504 : 502, requestId);
  }
}
