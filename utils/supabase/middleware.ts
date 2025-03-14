import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error("Supabase URL and ANON KEY must be provided");
  }

  const urlPath = new URL(request.url).pathname;
  const publicPaths = ["/", "/login", "/sign-up", "/reset-password"];
  const supabaseResponse = NextResponse.next();


  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) throw error;

    const hasSession = Boolean(sessionData.session);

    // if (!hasSession && !publicPaths.includes(urlPath)) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    return supabaseResponse;
  } catch (err) {
    console.error("Error updating session:", err);
    return NextResponse.error();
  }
}
