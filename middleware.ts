import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Simple middleware - just check if user is authenticated
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
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