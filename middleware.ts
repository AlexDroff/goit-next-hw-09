import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";

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
        const response = await checkSession();
        if (response && response.headers && response.headers["set-cookie"]) {
          const setCookie = response.headers["set-cookie"];
          const nextResponse = NextResponse.next();
          if (Array.isArray(setCookie)) {
            setCookie.forEach((cookie) => {
              nextResponse.headers.append("set-cookie", cookie);
            });
          } else {
            nextResponse.headers.set("set-cookie", setCookie);
          }
          return nextResponse;
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
