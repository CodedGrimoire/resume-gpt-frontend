import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { requestResumeAnalysis } from '../lib/uploadResume.mjs';

test('Analyze Resume click is wired to the request helper', async () => {
  const page = await readFile(new URL('../app/page.js', import.meta.url), 'utf8');

  assert.match(page, /onClick=\{onUpload\}/);
  assert.match(page, /disabled=\{!file \|\| loading\}/);
  assert.match(page, /setFile\(selectedFile\)/);
  assert.match(page, /onUpload=\{handleUpload\}/);
  assert.match(page, /requestResumeAnalysis\(file/);
});

test('upload helper sends the selected PDF to the same-origin proxy with the resume field', async () => {
  const appended = [];
  class MockFormData {
    append(name, value) { appended.push([name, value]); }
  }

  const file = { name: 'candidate.pdf', type: 'application/pdf', size: 1024 };
  let request;
  const expectedResponse = { ok: true, status: 200 };
  const { response, requestId } = await requestResumeAnalysis(file, {
    requestId: 'test-request-123',
    FormDataImpl: MockFormData,
    fetchImpl: async (url, options) => {
      request = { url, options };
      return expectedResponse;
    },
  });

  assert.equal(response, expectedResponse);
  assert.equal(request.url, '/api/upload');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['X-Request-Id'], 'test-request-123');
  assert.deepEqual(appended, [['resume', file]]);
  assert.equal(requestId, 'test-request-123');
});

test('invalid and oversized PDFs are rejected before fetch', async () => {
  let fetchCalled = false;
  const fetchImpl = async () => { fetchCalled = true; };

  await assert.rejects(
    requestResumeAnalysis({ name: 'resume.docx', type: 'application/msword', size: 10 }, { fetchImpl }),
    /choose a PDF/
  );
  await assert.rejects(
    requestResumeAnalysis({ name: 'large.pdf', type: 'application/pdf', size: 4 * 1024 * 1024 + 1 }, { fetchImpl }),
    /smaller than 4 MB/
  );
  assert.equal(fetchCalled, false);
});
