"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Leaf, Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check if session already exists, and if so redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push("/dashboard");
      }
    });
  }, [supabase, router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user && data.session) {
      // Auto logged in (e.g., if email confirmation is disabled in Supabase console)
      router.push("/onboarding");
    } else {
      setMessage("Registration successful! Check your email to confirm registration.");
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
          Create Account
        </h2>

        <p className="mt-3 font-semibold text-[#4B6356] text-sm">
          Sign up to track and reduce your carbon footprint.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border-2 border-black bg-[#FF8FB8] p-3 text-xs font-bold shadow-[2px_2px_0_#06130B]">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-xl border-2 border-black bg-[#C8F3DC] p-3 text-xs font-bold shadow-[2px_2px_0_#06130B] text-green-dark">
            {message}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label htmlFor="signup-email-input" className="text-xs font-black uppercase tracking-wider block">Email</label>
            <input
              id="signup-email-input"
              type="email"
              required
              className="mt-2 w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold outline-none focus:bg-[#C8F3DC] transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="signup-password-input" className="text-xs font-black uppercase tracking-wider block">Password</label>
            <input
              id="signup-password-input"
              type="password"
              required
              className="mt-2 w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold outline-none focus:bg-[#C8F3DC] transition-all"
              placeholder="•••••••• (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border-2 border-black bg-[#39E079] px-5 py-3 font-black shadow-[5px_5px_0_#06130B] transition hover:translate-y-[3px] hover:shadow-[2px_2px_0_#06130B] disabled:opacity-60 cursor-pointer font-grotesque text-lg"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="mt-6 text-center text-sm font-bold text-[#4B6356]">
          Already have an account?{" "}
          <a href="/login" className="text-[#0D8F45] underline font-black">
            Log In
          </a>
        </p>

      </div>
    </main>
  );
}
