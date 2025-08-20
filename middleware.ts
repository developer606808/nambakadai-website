import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If the user is not an admin and is trying to access an admin route, redirect them.
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    // Add other role-based protection here if needed (e.g., for /seller)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // A user is authorized if they have a token (are logged in).
    },
    pages: {
        signIn: '/admin', // Redirect users to admin login if they are not authorized.
    }
  }
);

// This specifies what routes the middleware will run on.
export const config = { 
    matcher: [
        "/admin/:path*", // Protect all admin sub-routes
        "/profile/:path*", // Example of protecting other routes
        "/seller/:path*",
    ]
};