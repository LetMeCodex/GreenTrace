"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Sparkles, 
  Bot, 
  Zap, 
  BarChart3, 
  User, 
  Leaf,
  Flame,
  ArrowLeft
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tracker", href: "/tracker", icon: ClipboardList },
  { label: "Simulator", href: "/simulator", icon: Sparkles },
  { label: "AI Coach", href: "/coach", icon: Bot },
  { label: "Insights", href: "/insights", icon: Zap },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
];

export function getInitials(name?: string | null, email?: string | null) {
  const source = name || email?.split("@")[0] || "GreenTrace User";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, entries } = useApp();

  const streak = entries && entries.length > 0 ? entries.length : 5;
  const todayDateStr = new Date().toISOString().split("T")[0];
  const todayEntry = entries?.find((e) => e.date === todayDateStr);
  const greenScore = todayEntry ? todayEntry.greenScore : (entries?.length > 0 ? entries[0].greenScore : 100);

  const displayName = user ? (user.name || user.email?.split("@")[0] || "GreenTrace User") : "GreenTrace User";
  const initials = user ? getInitials(user.name, user.email) : "GT";

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r-3 border-black bg-white p-6 pb-24 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 px-2 py-2.5 bg-brand-secondary border-3 border-black rounded-xl shadow-[3px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-1.5 rounded-lg bg-brand-green border-2 border-black">
          <Leaf className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-wider text-black font-display leading-none">
            GREEN<span className="text-black/70">TRACE</span>
          </h1>
          <p className="text-[9px] text-black font-black uppercase tracking-widest leading-none mt-1">
            Visible Impact
          </p>
        </div>
      </div>

      {/* Back Home Link */}
      <div className="mb-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white py-2.5 px-4 font-black shadow-[3px_3px_0_#06130B] transition hover:translate-y-[2px] hover:shadow-[1px_1px_0_#06130B] text-xs uppercase font-grotesque cursor-pointer"
        >
          <ArrowLeft size={14} className="text-black" />
          Back Home
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 border-2 border-black font-bold text-sm ${
                isActive
                  ? "bg-brand-green text-black shadow-[2px_3px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] translate-x-[-1px]"
                  : "bg-white text-black hover:bg-brand-secondary/40 hover:shadow-[1px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
              }`}
            >
              <Icon className="w-5 h-5 text-black" />
              <span className="font-grotesque text-base font-extrabold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Status at Bottom */}
      {user && (
        <Link
          href="/profile"
          className="block rounded-xl border-3 border-black p-4 bg-[#F2D048] shadow-[4px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[2px] hover:shadow-[2px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer mt-auto flex flex-col gap-2.5 relative z-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border-2 border-black flex items-center justify-center font-black text-black text-sm uppercase">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-black font-black uppercase tracking-wider leading-none">Climate Champ</p>
              <h4 className="text-lg font-black text-black truncate leading-none mt-1.5 font-grotesque">{displayName}</h4>
            </div>
          </div>
          
          <div className="pt-2 border-t-2 border-black flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-black text-black">
              <Flame className="w-4 h-4 text-black fill-black/10" />
              <span className="font-grotesque text-sm font-black">{streak} Day Streak</span>
            </div>
            <div className="font-black text-black text-xs">
              Score: {greenScore}/100
            </div>
          </div>
        </Link>
      )}
    </aside>
  );
};

