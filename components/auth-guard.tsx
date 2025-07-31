"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If we're still loading, don't do anything
    if (status === "loading") return;

    // If authentication is required but user is not authenticated
    if (requireAuth && status === "unauthenticated") {
      router.push(redirectTo);
      return;
    }

    // If user is authenticated but we don't want them to be (for public pages)
    if (!requireAuth && status === "authenticated") {
      // Don't redirect, just let them stay on the page
      // This allows authenticated users to view public pages
    }
  }, [status, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, don't render children
  if (requireAuth && status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
} 