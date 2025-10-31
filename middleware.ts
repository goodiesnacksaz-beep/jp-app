import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Only admin routes are protected now
    const adminRoutes = ["/admin"];
    const authRoutes = ["/login", "/signup"];

    const path = req.nextUrl.pathname;

    const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

    // Redirect to login if accessing admin route without session
    if (isAdminRoute && !session) {
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
            return NextResponse.redirect(new URL("/", req.url));
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
        "/admin/:path*",
        "/login",
        "/signup",
    ],
};

