export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export function createUploadRequestId() {
  return globalThis.crypto?.randomUUID?.() || `upload-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function validateResumeFile(file) {
  if (!file) throw new Error('Please select a PDF file first.');
  if (file.type !== 'application/pdf' || !file.name?.toLowerCase().endsWith('.pdf')) {
    throw new Error('Please choose a PDF file.');
  }
  if (file.size > MAX_RESUME_BYTES) {
    throw new Error('This PDF is too large for the upload service. Choose a PDF smaller than 4 MB.');
  }
}

export async function requestResumeAnalysis(file, {
  fetchImpl = fetch,
  FormDataImpl = FormData,
  signal,
  requestId = createUploadRequestId(),
  onStage = () => {},
} = {}) {
  onStage('file.validation.started', { requestId });
  validateResumeFile(file);
  onStage('file.validation.passed', { requestId, bytes: file.size });

  const formData = new FormDataImpl();
  formData.append('resume', file);

  onStage('frontend.fetch.started', { requestId, path: '/api/upload' });
  const response = await fetchImpl('/api/upload', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: formData,
    signal,
  });

  return { response, requestId };
}
