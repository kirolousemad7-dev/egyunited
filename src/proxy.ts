import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  // An explicit /ar or /en URL, then the saved cookie, decide the language.
  // The browser language must not override either of them.
  headers.delete("accept-language");
  return handleI18nRouting(new NextRequest(request.url, { headers }));
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
