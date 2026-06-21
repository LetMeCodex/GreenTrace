"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useApp } from "../../context/AppContext";
import { OnboardingFlow } from "../onboarding/OnboardingFlow";
import { Leaf } from "lucide-react";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, sessionUser, loading, isSupabase } = useApp();

  // Premium eco-brutalist loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="neo-box max-w-sm w-full text-center flex flex-col items-center gap-4">
          <div className="p-4 rounded-xl bg-brand-green border-3 border-black shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            <Leaf className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-wider text-black">
            GREEN<span className="text-brand-green">TRACE</span>
          </h2>
          <p className="text-sm text-black font-semibold uppercase tracking-widest">
            Compiling ecological parameters...
          </p>
        </div>
      </div>
    );
  }

  // Root landing and login pages are accessible without auth check
  if (pathname === "/" || pathname === "/login") {
    return (
      <div className="min-h-screen bg-brand-bg text-black relative overflow-x-hidden pb-16">
        {children}
      </div>
    );
  }

  // Force login for any dashboard/app/onboarding paths if no authenticated session exists
  if (isSupabase && !sessionUser) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Force onboarding for any dashboard/app paths if no profile exists
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg text-black relative overflow-x-hidden flex items-center justify-center p-4">
        <div className="w-full max-w-xl z-10">
          <OnboardingFlow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-black relative overflow-x-hidden flex">
      {/* Navigation */}
      <Sidebar />
      <MobileNav />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 md:p-8 md:pl-72 pb-28 md:pb-24 z-10">
        <div className="max-w-6xl mx-auto w-full page-transition">
          {children}
        </div>
      </main>

      {/* Bottom Marquee activity feed */}
      <div className="marquee-feed">
        <p>
          <span>GreenTrace Live Impact:</span>
          <span>Anish saved 1.8 kg CO₂e today!</span>
          <span>Priya completed a No Delivery Day!</span>
          <span>Rohan switched to metro and saved ₹60!</span>
          <span>Meera reached a 7-day reusable bottle streak!</span>
          <span>Bengaluru users saved 240 kg CO₂e this week!</span>
        </p>
      </div>
    </div>
  );
};
