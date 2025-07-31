import { NextRequest, NextResponse } from 'next/server';
import { checkSessionHealth } from '@/lib/session-cleanup';

export async function GET(_request: NextRequest) {
  try {
    const health = await checkSessionHealth();
    
    if (!health.healthy) {
      return NextResponse.json({
        status: 'unhealthy',
        error: health.error,
        message: 'Session validation failed - users may need to re-authenticate',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }
    
    return NextResponse.json({
      status: 'healthy',
      message: 'Session validation successful',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Session health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check session health',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 