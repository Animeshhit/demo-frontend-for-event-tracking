import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  
  let deviceId = request.cookies.get('device_id')?.value

  if (!deviceId) {
    deviceId = crypto.randomUUID()
    
    response.cookies.set('device_id', deviceId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      httpOnly: false, // Set to true if only needed by the server
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  }

  return response
}
