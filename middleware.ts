import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPrivateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const sessionRes = await fetch(
          new URL("/api/auth/session", request.url),
          {
            method: "GET",
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          }
        );

        if (sessionRes.ok) {
          const setCookie = sessionRes.headers.get("set-cookie");
          const response = NextResponse.next();
          if (setCookie) {
            response.headers.set("set-cookie", setCookie);
          }
          return response;
        }
      } catch {}
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
