import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    console.log("Token:", token);
    console.log("Request URL:", request.url);

    const isProtected =
        !request.nextUrl.pathname.startsWith("/connexion") &&
        request.nextUrl.pathname !== "/";

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/connexion", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
