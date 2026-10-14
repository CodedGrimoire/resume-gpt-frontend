import { NextResponse } from 'next/server';

// Keep the proxy's request bounded so the browser always receives a result.
export const maxDuration = 60;

/**
 * Next.js API Route: /api/upload
 * Proxies upload requests to the backend server
 * For localhost: uses http://localhost:3003
 * For production: uses NEXT_PUBLIC_BACKEND_URL or default Render URL
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Determine backend URL - remove trailing slashes
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                     (process.env.NODE_ENV === 'development' 
                       ? 'http://localhost:3003' 
                       : 'https://resume-gpt-backend-7s7f.onrender.com');
    
    // Remove trailing slash if present
    backendUrl = backendUrl.replace(/\/+$/, '');
    
    const uploadUrl = `${backendUrl}/upload`;
    console.log(`[API Route] Proxying upload to: ${uploadUrl}`);
    console.log(`[API Route] Backend URL from env: ${process.env.NEXT_PUBLIC_BACKEND_URL || 'not set'}`);
    console.log(`[API Route] NODE_ENV: ${process.env.NODE_ENV}`);

    // Forward the request to the backend
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(55_000),
    });

    // Check if response is OK
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Upload failed (${response.status})`;
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText.includes('<!DOCTYPE') || response.status === 404
          ? `The analysis endpoint was not found on the backend (${response.status}). Check the backend deployment.`
          : errorText.substring(0, 200) || errorMessage;
      }
      
      console.error('[API Route] Backend error:', response.status);
      console.error('[API Route] Error message:', errorMessage);
      console.error('[API Route] Attempted URL:', uploadUrl);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Check content-type before parsing JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[API Route] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Server returned non-JSON response. Please check the backend configuration.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[API Route] Upload Error:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'The analysis service did not respond within 55 seconds. Please try again in a moment.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Failed to process upload',
        message: error.message || 'An internal server error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}
