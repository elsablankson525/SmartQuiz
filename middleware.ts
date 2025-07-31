import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if user is authenticated
    if (!req.nextauth.token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // User is authenticated, allow access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only allow access if token exists (user is authenticated)
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/analytics/:path*",
    "/quiz/:path*",
    "/subjects/:path*",
    "/learning-paths/:path*",
    "/recommendations/:path*",
    "/leaderboard/:path*",
  ],
}; 