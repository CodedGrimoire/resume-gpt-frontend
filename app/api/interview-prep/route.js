import { NextResponse } from 'next/server';

/**
 * Next.js API Route: /api/interview-prep
 * Proxies interview prep requests to the backend server
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Determine backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                      (process.env.NODE_ENV === 'development' 
                        ? 'http://localhost:3003' 
                        : 'https://resume-gpt-backend-7s7f.onrender.com');

    console.log(`[API Route] Proxying interview prep to: ${backendUrl}/interview-prep`);

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/interview-prep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Check if response is OK
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Interview prep failed (${response.status})`;
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText.includes('<!DOCTYPE')) {
          errorMessage = `Interview prep endpoint not found (404). Check if backend server is running at ${backendUrl}`;
        } else {
          errorMessage = errorText.substring(0, 200);
        }
      }
      
      console.error('[API Route] Backend error:', response.status, errorMessage);
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
    console.error('[API Route] Interview Prep Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate interview prep',
        message: error.message || 'An internal server error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}
