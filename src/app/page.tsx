"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Leaf, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Bot, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  TrendingDown,
  ChevronRight,
  HelpCircle,
  Footprints
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(Boolean(data.user));
    });
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-ink relative overflow-x-hidden grid-bg pb-12 font-sans">
      
      {/* Premium Navbar */}
      <header className="border-b-2 border-brutalist-border bg-bg-main sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-mint-highlight border-2 border-brutalist-border">
              <Leaf className="w-5 h-5 text-green-dark" />
            </div>
            <span className="text-xl font-black tracking-tight font-grotesque text-ink">
              Green<span className="text-green-accent">Trace</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="text-xs md:text-sm font-black text-ink hover:text-red-600 transition-colors uppercase tracking-wider bg-transparent border-0 cursor-pointer font-sans"
                >
                  Sign Out
                </button>
                <Link
                  href="/dashboard"
                  className="text-xs md:text-sm font-black bg-green-accent text-ink border-2 border-brutalist-border py-2 px-5 rounded-xl shadow-[3px_3px_0px_0px_rgba(6,19,11,1)] transition-all duration-200 hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(6,19,11,1)]"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-xs md:text-sm font-black text-ink hover:text-green-dark transition-colors uppercase tracking-wider"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="text-xs md:text-sm font-black bg-green-accent text-ink border-2 border-brutalist-border py-2 px-5 rounded-xl shadow-[3px_3px_0px_0px_rgba(6,19,11,1)] transition-all duration-200 hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(6,19,11,1)]"
                >
                  Start Tracking
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 lg:py-24 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Headlines & Copy */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-highlight border-2 border-brutalist-border shadow-[2px_2px_0px_0px_rgba(6,19,11,1)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-dark animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-ink uppercase">
              Small choices. Visible impact.
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-ink leading-[1.05] uppercase font-grotesque"
          >
            <span className="block text-ink">YOUR PERSONAL</span>
            <span className="block text-ink">CARBON FOOTPRINT,</span>
            <span className="inline-block bg-green-accent text-ink border-2 border-brutalist-border px-4 py-1.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(6,19,11,1)] transform -rotate-1 mt-2 font-display text-3xl md:text-5xl lg:text-6xl">
              MADE SIMPLE.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-sm md:text-base text-ink font-semibold max-w-[620px] leading-relaxed"
          >
            GreenTrace shows where your emissions come from, tracks your daily habits, and gives simple personalized actions to reduce your impact. No guilt. Just better choices.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto justify-center lg:justify-start"
          >
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="flex items-center justify-center gap-2 font-black text-sm bg-green-accent text-ink py-3.5 px-8 border-2 border-brutalist-border rounded-[14px] shadow-[4px_4px_0px_0px_rgba(6,19,11,1)] transition-all duration-200 hover:translate-y-[3px] hover:shadow-[1px_1px_0px_0px_rgba(6,19,11,1)] group"
            >
              Start Tracking →
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Premium Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Depth background gradient/blur blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-mint-highlight/40 blur-3xl -z-10" />

          {/* Dashboard Preview Card */}
          <div className="bg-card-bg border-2 border-brutalist-border rounded-3xl p-5 md:p-6 shadow-[6px_8px_0px_0px_rgba(6,19,11,1)] space-y-5 relative">
            
            {/* Widget Header */}
            <div className="flex justify-between items-center pb-3 border-b-2 border-ink/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-accent border border-brutalist-border animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-ink font-grotesque">
                  GREEN INTELLIGENCE
                </span>
              </div>
              <span className="text-[10px] font-black text-muted-text uppercase">Updated today</span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Green Score Card */}
              <div className="p-3.5 rounded-xl bg-bg-mint/30 border-2 border-brutalist-border flex flex-col justify-between shadow-[2px_3px_0px_0px_rgba(6,19,11,1)]">
                <span className="text-[9px] uppercase font-black text-muted-text tracking-wider">Green Score</span>
                <span className="text-2xl font-extrabold text-green-dark mt-0.5 font-grotesque">
                  74<span className="text-xs text-muted-text font-sans">/100</span>
                </span>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[8px] font-bold text-ink/80 uppercase">
                    <span>Good progress</span>
                    <span>+4 pts</span>
                  </div>
                  <div className="w-full bg-ink/10 h-1.5 rounded-full overflow-hidden border border-ink/25">
                    <div className="bg-green-accent h-full" style={{ width: "74%" }} />
                  </div>
                </div>
              </div>

              {/* Today's CO2e Card */}
              <div className="p-3.5 rounded-xl bg-card-bg border-2 border-brutalist-border flex flex-col justify-between shadow-[2px_3px_0px_0px_rgba(6,19,11,1)]">
                <span className="text-[9px] uppercase font-black text-muted-text tracking-wider">Today's CO₂e</span>
                <span className="text-2xl font-extrabold text-ink mt-0.5 font-grotesque">
                  5.9 <span className="text-xs font-bold text-muted-text">kg</span>
                </span>
                <div className="mt-2 flex items-center gap-1 bg-green-accent/15 border border-green-accent/30 rounded px-1.5 py-0.5 w-fit">
                  <TrendingDown className="w-3.5 h-3.5 text-green-dark" />
                  <span className="text-[8px] font-black text-green-dark uppercase">12% below average</span>
                </div>
              </div>
            </div>

            {/* Footprint Diagnosis Card */}
            <div className="p-4 rounded-xl bg-bg-mint/15 border-2 border-brutalist-border space-y-1.5 shadow-[2px_3px_0px_0px_rgba(6,19,11,1)]">
              <div className="flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-green-dark" />
                <span className="text-[10px] font-black text-ink uppercase tracking-wider">Footprint Diagnosis</span>
              </div>
              <p className="text-[11px] text-ink leading-relaxed font-semibold">
                Your commute caused <strong className="text-ink font-black">52%</strong> of today's footprint. Switching two short rides to walking this week can save <span className="text-green-dark font-black bg-green-accent/30 px-1 rounded">1.4 kg CO₂e</span>.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Travel 52%", bg: "bg-blue-accent/20" },
                { label: "Food 24%", bg: "bg-yellow-accent/20" },
                { label: "Energy 14%", bg: "bg-pink-accent/20" },
                { label: "Shopping 7%", bg: "bg-mint-highlight/20" },
                { label: "Waste 3%", bg: "bg-orange-accent/20" }
              ].map((item, idx) => (
                <span key={idx} className={`text-[9px] font-extrabold text-ink px-2 py-0.5 rounded-md border-2 border-brutalist-border ${item.bg}`}>
                  {item.label}
                </span>
              ))}
            </div>

            {/* Weekly Trend Mini Bar Chart */}
            <div className="space-y-2 pt-1">
              <span className="text-[9px] uppercase font-black text-muted-text tracking-wider block">Weekly Trend (kg CO₂e)</span>
              <div className="h-20 flex items-end justify-between gap-1.5 pt-2 px-2 border-b-2 border-l-2 border-ink">
                {[
                  { day: "M", val: 7.8 },
                  { day: "T", val: 6.9 },
                  { day: "W", val: 8.1 },
                  { day: "T", val: 5.9 },
                  { day: "F", val: 6.3 },
                  { day: "S", val: 4.8, highlight: true },
                  { day: "S", val: 5.2 }
                ].map((item, i) => {
                  const pct = Math.round((item.val / 8.1) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="relative group w-full flex justify-center">
                        <span className="absolute bottom-full mb-1 bg-ink text-card-bg text-[8px] font-bold px-1 rounded border border-ink opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.val}
                        </span>
                        <div 
                          style={{ height: `${pct}%` }} 
                          className={`w-full rounded-t border-t-2 border-x-2 border-brutalist-border transition-all duration-500 ${
                            item.highlight ? "bg-yellow-accent" : "bg-green-accent"
                          }`}
                        />
                      </div>
                      <span className="text-[8px] font-black text-ink mt-0.5">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="bg-bg-mint/20 py-20 border-y-2 border-brutalist-border relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight font-grotesque">
            Why is reducing carbon footprint so hard?
          </h2>
          <p className="text-sm md:text-base text-ink font-semibold leading-relaxed max-w-2xl mx-auto">
            Most people want to help, but climate change feels abstract. General carbon calculators are boring, use complicated metrics, or rely on guilt-trips. You don't know if air drying your laundry matters more than skipping beef once, or if online orders are ruining your score.
          </p>
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-card-bg rounded-2xl p-5 border-2 border-brutalist-border shadow-[4px_4px_0px_0px_rgba(6,19,11,1)]">
              <h4 className="font-black text-ink text-sm uppercase">Where are emissions coming from?</h4>
              <p className="text-[12px] text-muted-text font-bold mt-2">Get direct diagnosis cards identifying your biggest footprint drivers every single day.</p>
            </div>
            <div className="bg-card-bg rounded-2xl p-5 border-2 border-brutalist-border shadow-[4px_4px_0px_0px_rgba(6,19,11,1)]">
              <h4 className="font-black text-ink text-sm uppercase">What simple actions can I take?</h4>
              <p className="text-[12px] text-muted-text font-bold mt-2">Get 3 bite-sized daily recommendations optimized for carbon, difficulty, and money saved.</p>
            </div>
            <div className="bg-card-bg rounded-2xl p-5 border-2 border-brutalist-border shadow-[4px_4px_0px_0px_rgba(6,19,11,1)]">
              <h4 className="font-black text-ink text-sm uppercase">How much am I actually saving?</h4>
              <p className="text-[12px] text-muted-text font-bold mt-2">See your impact in equivalents you understand: smartphone charges, trees planted, and money saved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-ink">How GreenTrace Works</h2>
          <p className="text-muted-text font-bold text-xs max-w-lg mx-auto uppercase">Build climate habit tracking into your lifestyle in three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Track daily habits in 60s",
              desc: "Enter basic metrics for travel, food, energy, shopping, and circular waste. Sliders and toggles make inputs quick and simple."
            },
            {
              step: "02",
              title: "Understand your footprint",
              desc: "Your data is translated instantly into clean charts. Your Green Score scales up or down based on your decisions."
            },
            {
              step: "03",
              title: "Take personalized action",
              desc: "Complete daily carbon challenges to build streaks, unlock achievements, and see cumulative carbon and financial savings."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-card-bg rounded-2xl p-6 border-2 border-brutalist-border relative space-y-4 shadow-[4px_4px_0px_0px_rgba(6,19,11,1)]">
              <span className="text-4xl font-black text-green-accent block font-display">{item.step}</span>
              <h3 className="text-lg font-black text-ink uppercase">{item.title}</h3>
              <p className="text-xs text-muted-text font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-bg-mint/20 py-20 border-t-2 border-brutalist-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-ink uppercase">Engineered for Action</h2>
            <p className="text-muted-text font-bold text-xs max-w-lg mx-auto uppercase">A premium suite of tools turning footprint calculations into micro habit changes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "Daily Footprint Tracker", desc: "Easily log commute modes, dietary habits, AC usage, shopping, and bag/bottle reuse in seconds." },
              { icon: Leaf, title: "Dynamic Green Score", desc: "A score from 1 to 100 representing your eco-efficiency. Moves dynamically as you build sustainable habits." },
              { icon: Sparkles, title: "What-If Simulator", desc: "Compare alternatives side-by-side. See carbon and cost savings before you commute or shop." },
              { icon: Bot, title: "AI Carbon Coach", desc: "A context-aware coach named Trace. Analyzes your history to deliver actionable advice on how to improve." },
              { icon: Zap, title: "Pattern Insights Engine", desc: "Identifies anomalies like 'Your footprint rises 18% on Mondays due to commutes' to help change behavior." },
              { icon: BarChart3, title: "Weekly Impact Reports", desc: "Summarizes weekly achievements. Share a premium digital badge highlighting your score and streaks." }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-card-bg rounded-2xl p-6 border-2 border-brutalist-border space-y-3 hover:bg-bg-mint/10 shadow-[4px_4px_0px_0px_rgba(6,19,11,1)] transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-bg-mint border-2 border-brutalist-border flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green-dark" />
                  </div>
                  <h3 className="text-base font-black text-ink uppercase">{feat.title}</h3>
                  <p className="text-xs text-muted-text font-semibold leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Insight Callout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="bg-card-bg rounded-3xl p-8 border-2 border-brutalist-border grid md:grid-cols-12 gap-8 items-center shadow-[6px_8px_0px_0px_rgba(6,19,11,1)] bg-gradient-to-r from-bg-mint/5 to-bg-mint/20">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[10px] font-black text-green-dark uppercase tracking-widest bg-mint-highlight border-2 border-brutalist-border px-3 py-1 rounded-md">
              Live diagnosis example
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-ink">"Your commute caused 52% of today's footprint."</h2>
            <p className="text-xs md:text-sm text-muted-text font-bold leading-relaxed">
              GreenTrace doesn't just calculate your emissions; it extracts specific choices. It tells you exactly how switching two short car rides to public transit saves carbon and saves money.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end w-full">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="flex items-center gap-2 text-sm font-black bg-green-accent text-ink py-3.5 px-6 border-2 border-brutalist-border rounded-[14px] shadow-[4px_4px_0px_0px_rgba(6,19,11,1)] transition-all duration-200 hover:translate-y-[3px] hover:shadow-[1px_1px_0px_0px_rgba(6,19,11,1)] w-full justify-center md:w-auto text-center"
            >
              Try it Yourself
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t-2 border-brutalist-border py-20 text-center space-y-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-ink uppercase">Start building better habits today.</h2>
        <p className="text-muted-text font-bold text-sm max-w-sm mx-auto uppercase">Track your footprint. Change your impact. Small actions build visible change.</p>
        <div className="pt-2">
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 font-black text-sm bg-green-accent text-ink py-3.5 px-8 border-2 border-brutalist-border rounded-[14px] shadow-[4px_4px_0px_0px_rgba(6,19,11,1)] transition-all duration-200 hover:translate-y-[3px] hover:shadow-[1px_1px_0px_0px_rgba(6,19,11,1)] group"
          >
            Start Tracking Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-brutalist-border bg-card-bg py-8 text-center text-xs text-muted-text font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-dark" />
            <span className="font-black text-ink">GreenTrace</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink transition-colors">Methodology</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
