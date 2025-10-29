import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protected routes
    const protectedRoutes = ["/dashboard", "/settings", "/quiz"];
    const adminRoutes = ["/admin"];
    const authRoutes = ["/login", "/signup"];

    const path = req.nextUrl.pathname;

    // Check if accessing protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check admin access
    if (isAdminRoute && session) {
        const { data: user } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();

        if (!user || user.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    // Redirect to dashboard if accessing auth routes with active session
    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/settings/:path*",
        "/quiz/:path*",
        "/admin/:path*",
        "/login",
        "/signup",
    ],
};

