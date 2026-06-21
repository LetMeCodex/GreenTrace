import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Capture incoming auth errors from Supabase
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorCode = searchParams.get("error_code");

  if (error) {
    console.error("Auth callback received error from provider/Supabase:", error, errorDescription, errorCode);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(
        errorDescription || ""
      )}&error_code=${encodeURIComponent(errorCode || "")}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Auth callback code exchange error:", exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=exchange_error&error_description=${encodeURIComponent(exchangeError.message)}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed&error_description=No+auth+code+or+error+present+in+callback`);
}

