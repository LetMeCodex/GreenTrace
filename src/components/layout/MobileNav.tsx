"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Sparkles, 
  Bot, 
  User 
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const mobileItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Track", href: "/tracker", icon: ClipboardList },
    { label: "What-If", href: "/simulator", icon: Sparkles },
    { label: "Coach", href: "/coach", icon: Bot },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-12 left-0 right-0 h-16 border-t-3 border-black bg-white px-2 flex items-center justify-around z-40 pb-safe">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all border-2 ${
              isActive
                ? "bg-brand-green border-black shadow-[1.5px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] text-black"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-bold font-grotesque leading-none uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
