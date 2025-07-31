'use client';

import { useAuth } from '@/hooks/use-auth';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function AuthTest() {
  const { status, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        alert('Sign in failed: ' + result.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>
            Test the authentication system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status:</Label>
            <div className="text-sm font-mono bg-gray-100 p-2 rounded">
              {status}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Authenticated:</Label>
            <div className="text-sm font-mono bg-gray-100 p-2 rounded">
              {isAuthenticated ? 'Yes' : 'No'}
            </div>
          </div>
          
          {user && (
            <div className="space-y-2">
              <Label>User Info:</Label>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                <div>ID: {user.id}</div>
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
              </div>
            </div>
          )}
          
          {!isAuthenticated ? (
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  required
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Signing in...' : 'Sign in with Credentials'}
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-gray-500">or</span>
              </div>
              
              <Button
                type="button"
                onClick={() => signIn('google')}
                variant="outline"
                className="w-full"
              >
                Sign in with Google
              </Button>
              
              <Button
                type="button"
                onClick={() => signIn('github')}
                variant="outline"
                className="w-full"
              >
                Sign in with GitHub
              </Button>
            </form>
          ) : (
            <Button onClick={handleSignOut} variant="destructive" className="w-full">
              Sign Out
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 