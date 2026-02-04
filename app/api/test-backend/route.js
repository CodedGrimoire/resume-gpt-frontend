import { NextResponse } from 'next/server';

/**
 * Test endpoint to check backend connectivity
 * GET /api/test-backend
 */
export async function GET() {
  try {
    // Determine backend URL - remove trailing slashes
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                     (process.env.NODE_ENV === 'development' 
                       ? 'http://localhost:3003' 
                       : 'https://resume-gpt-backend-7s7f.onrender.com');
    
    // Remove trailing slash if present
    backendUrl = backendUrl.replace(/\/+$/, '');
    
    const testUrl = `${backendUrl}/`;
    
    console.log(`[Test] Checking backend at: ${testUrl}`);
    console.log(`[Test] NEXT_PUBLIC_BACKEND_URL: ${process.env.NEXT_PUBLIC_BACKEND_URL || 'not set'}`);
    console.log(`[Test] NODE_ENV: ${process.env.NODE_ENV}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      backendUrl: backendUrl,
      testUrl: testUrl,
      contentType: contentType,
      responsePreview: text.substring(0, 200),
      message: response.ok 
        ? 'Backend is reachable!' 
        : `Backend returned ${response.status}: ${response.statusText}`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'not set',
      message: 'Cannot reach backend server. Check if it is running and the URL is correct.'
    }, { status: 500 });
  }
}
