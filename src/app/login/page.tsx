"use client";

import React, { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Leaf, Send, Sparkles, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Supabase credentials are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local and restart the dev server.");
      return;
    }

    // Capture OAuth errors passed back from the callback route
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      const urlErrorDesc = params.get("error_description");
      const urlErrorCode = params.get("error_code");

      if (urlError) {
        let msg = `Authentication Error: ${urlErrorDesc || urlError}`;
        if (urlErrorCode) {
          msg += ` (${urlErrorCode})`;
        }
        if (urlErrorDesc?.includes("Unable to exchange external code")) {
          msg += "\n\n💡 Troubleshooting Tip: This error indicates that Supabase could not verify your code with Google. Please check that your Client ID & Client Secret in your Supabase Dashboard (Auth > Providers > Google) match Google Cloud Console, and ensure 'https://psaicqecctgkythybrhi.supabase.co/auth/v1/callback' is added under Authorized redirect URIs in Google Cloud Console.";
        }
        setError(msg);
      }
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          router.push("/dashboard");
        }
      });
    }
  }, [supabase, router]);

  const handleDemoBypass = () => {
    router.push("/onboarding");
  };

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    setError("");
    setLoadingEmail(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoadingEmail(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    if (!isSupabaseConfigured) return;
    setError("");
    setLoadingGoogle(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoadingGoogle(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F1E8] text-[#06130B] flex items-center justify-center px-6 py-12 font-sans grid-bg">
      <div className="w-full max-w-md rounded-[28px] border-2 border-black bg-[#FFFDF7] p-8 shadow-[10px_10px_0_#06130B]">
        
        {/* Logo Section */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-[#9EF0C0] shadow-[2px_2px_0_#06130B]">
            <Leaf size={24} className="text-[#0D8F45]" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight font-grotesque">
              Green<span className="text-[#39E079]">Trace</span>
            </h1>
            <p className="text-xs font-bold text-[#4B6356]">
              Track your footprint. Change your impact.
            </p>
          </div>
        </div>

        <h2 className="text-4xl font-black leading-none uppercase font-grotesque">
          Welcome back.
        </h2>

        <p className="mt-3 font-semibold text-[#4B6356] text-sm">
          Log in to continue tracking your carbon footprint.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border-2 border-black bg-[#FF8FB8] p-3 text-xs font-bold shadow-[2px_2px_0_#06130B] whitespace-pre-line leading-relaxed">
            {error}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email-input" className="text-xs font-black uppercase tracking-wider block">Email</label>
            <input
              id="email-input"
              type="email"
              required
              disabled={!isSupabaseConfigured}
              className="mt-2 w-full rounded-xl border-2 border-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-3 text-sm font-bold outline-none focus:bg-[#C8F3DC] transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password-input" className="text-xs font-black uppercase tracking-wider block">Password</label>
            <input
              id="password-input"
              type="password"
              required
              disabled={!isSupabaseConfigured}
              className="mt-2 w-full rounded-xl border-2 border-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-3 text-sm font-bold outline-none focus:bg-[#C8F3DC] transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loadingEmail || !isSupabaseConfigured}
            className="w-full rounded-xl border-2 border-black bg-[#39E079] px-5 py-3 font-black shadow-[5px_5px_0_#06130B] transition hover:translate-y-[3px] hover:shadow-[2px_2px_0_#06130B] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-grotesque text-lg"
          >
            {loadingEmail ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-[2px] flex-1 bg-black/10" />
          <span className="text-xs font-black text-[#4B6356]">OR</span>
          <div className="h-[2px] flex-1 bg-black/10" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle || !isSupabaseConfigured}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-black bg-white px-5 py-3 font-black shadow-[5px_5px_0_#06130B] transition hover:translate-y-[3px] hover:bg-[#C8F3DC] hover:shadow-[2px_2px_0_#06130B] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-grotesque text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loadingGoogle ? "Redirecting..." : "Continue with Google"}
        </button>

        {/* Footer Navigation */}
        <p className="mt-6 text-center text-sm font-bold text-[#4B6356]">
          New to GreenTrace?{" "}
          <a href="/signup" className="text-[#0D8F45] underline font-black">
            Create account
          </a>
        </p>

        {/* Bypass Demo Option */}
        {!isSupabaseConfigured && (
          <div className="pt-4 border-t-2 border-dashed border-black/20 text-center space-y-2 mt-6">
            <p className="text-[10px] font-black text-[#4B6356] uppercase tracking-wider">
              Running in local demo mode
            </p>
            <button
              onClick={handleDemoBypass}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FFD84D] px-4 py-2 text-xs font-black shadow-[3px_3.5px_0_#06130B] transition hover:translate-y-[2px] hover:shadow-[1.5px_1.5px_0_#06130B] cursor-pointer"
            >
              Bypass to Onboarding Flow
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
