'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SessionResetProps {
  error?: string;
}

export default function SessionReset({ error }: SessionResetProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      // Clear all cookies and localStorage
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Clear NextAuth specific cookies
        const nextAuthCookies = [
          'next-auth.session-token',
          'next-auth.csrf-token',
          'next-auth.callback-url',
          '__Secure-next-auth.session-token',
          '__Secure-next-auth.csrf-token',
          '__Secure-next-auth.callback-url'
        ];

        nextAuthCookies.forEach(cookieName => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
        });
      }
      
      // Sign out from NextAuth
      await signOut({ callbackUrl: '/login' });
      
    } catch (error) {
      console.error('Error resetting session:', error);
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="space-y-3">
            <p>
              <strong>Authentication Error Detected</strong>
            </p>
            <p className="text-sm">
              {error || 'Your session appears to be invalid or corrupted. This can happen when the authentication system is updated.'}
            </p>
            <p className="text-sm">
              Click the button below to clear your session and log in again.
            </p>
            <Button 
              onClick={handleReset}
              disabled={isResetting}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Session & Log In Again'
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
} 