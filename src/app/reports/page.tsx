"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingDown, 
  Calendar, 
  Award, 
  Share2, 
  CheckCircle, 
  Flame, 
  Download,
  Leaf
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Reports() {
  const { entries, actions } = useApp();
  const [copied, setCopied] = useState(false);

  // Compute metrics
  const totalWeekly = Number(entries.reduce((sum, e) => sum + e.totalCO2e, 0).toFixed(1));
  const avgDaily = Number((totalWeekly / Math.max(1, entries.length)).toFixed(1));

  // Find best and worst days
  let bestDay = { date: "N/A", value: 999 };
  let worstDay = { date: "N/A", value: 0 };

  entries.forEach((e) => {
    const dayName = new Date(e.date).toLocaleDateString("en-US", { weekday: "long" });
    if (e.totalCO2e < bestDay.value) {
      bestDay = { date: dayName, value: e.totalCO2e };
    }
    if (e.totalCO2e > worstDay.value) {
      worstDay = { date: dayName, value: e.totalCO2e };
    }
  });

  const completedActions = actions.filter((a) => a.completed);
  const carbonSavedActions = Number(
    completedActions.reduce((sum, a) => sum + a.estimatedCarbonSaved, 0).toFixed(1)
  );

  const startScore = 68;
  const currentScore = entries.length > 0 ? entries[0].greenScore : 74;

  const handleShare = () => {
    const text = `🌱 GreenTrace Weekly Impact Report:
    • Green Score: ${currentScore}/100
    • Weekly Carbon Saved: ${carbonSavedActions + 12.5} kg CO₂e
    • Habits Completed: ${completedActions.length} actions
    • 5-day green streak
    Track your footprint. Change your impact. Join GreenTrace!`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-text">Weekly Impact Report</h2>
          <p className="text-xs text-brand-muted mt-1">Review your carbon balance sheet and share your sustainable achievements.</p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 font-bold text-xs bg-white/5 hover:bg-white/10 border border-brand-border px-4 py-2.5 rounded-xl transition duration-300"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-green" />
          {copied ? "Copied Link!" : "Share Report"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Summary Metrics */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Carbon stats card */}
          <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-4">
            <h3 className="text-sm font-bold text-brand-text">Weekly Performance Summary</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-brand-muted block">Total Weekly footprint</span>
                <span className="text-2xl font-extrabold text-brand-cyan block mt-1">{totalWeekly} kg</span>
                <span className="text-[10px] text-brand-green font-semibold mt-1 block">8% below last week</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-brand-muted block">Daily average</span>
                <span className="text-2xl font-extrabold text-brand-text block mt-1">{avgDaily} kg</span>
                <span className="text-[10px] text-brand-muted mt-1 block">Baseline standard is 10.0 kg</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 bg-brand-green/5 border border-brand-green/10 rounded-xl">
                <Calendar className="w-5 h-5 text-brand-green" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">Best Low-Carbon Day</span>
                  <span className="text-xs font-bold text-brand-text mt-0.5 block">{bestDay.date} ({bestDay.value} kg)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-brand-red/5 border border-brand-red/10 rounded-xl">
                <Calendar className="w-5 h-5 text-brand-red" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">Highest Carbon Day</span>
                  <span className="text-xs font-bold text-brand-text mt-0.5 block">{worstDay.date} ({worstDay.value} kg)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action check statistics */}
          <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-4">
            <h3 className="text-sm font-bold text-brand-text">Habit Accomplishments</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-muted">Completed actions this week</span>
                <span className="font-bold text-brand-text">{completedActions.length} completed</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-green h-full rounded-full" style={{ width: `${(completedActions.length / 7) * 100}%` }} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {completedActions.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-center gap-2 text-brand-muted">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span className="truncate">{act.title}</span>
                  </div>
                ))}
                {completedActions.length === 0 && (
                  <div className="text-brand-muted italic">No actions completed this week. Mark actions off on the dashboard to build your score!</div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Shareable Card Mockup */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl border border-brand-border p-6 relative overflow-hidden bg-gradient-to-tr from-brand-secondary via-brand-bg to-brand-green/10 shadow-2xl text-center flex flex-col justify-between min-h-[360px]">
            {/* Glowing accents */}
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-brand-green/20 blur-xl" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-brand-cyan/20 blur-xl" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-brand-green/10">
                  <Leaf className="w-4 h-4 text-brand-green glow-green" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted">GreenTrace Summary</span>
              </div>
              <span className="text-[9px] text-brand-muted">June 2026</span>
            </div>

            <div className="py-6 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">Carbon reduction impact</span>
              <h2 className="text-4xl font-extrabold text-brand-green glow-green">
                -{carbonSavedActions + 12.5} <span className="text-lg font-semibold text-brand-text">kg</span>
              </h2>
              <p className="text-xs text-brand-muted">CO₂e eliminated from the environment</p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 text-center">
              <div>
                <span className="text-[8px] uppercase font-bold text-brand-muted block">Streak</span>
                <div className="flex items-center justify-center gap-1 mt-1 text-brand-yellow font-extrabold text-sm">
                  <Flame className="w-3.5 h-3.5 fill-brand-yellow/10" />
                  <span>5 Days</span>
                </div>
              </div>

              <div>
                <span className="text-[8px] uppercase font-bold text-brand-muted block">Score</span>
                <span className="text-sm font-extrabold text-brand-green block mt-1">{currentScore}/100</span>
              </div>

              <div>
                <span className="text-[8px] uppercase font-bold text-brand-muted block">Completed</span>
                <span className="text-sm font-extrabold text-brand-cyan block mt-1">{completedActions.length} habits</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2 items-center">
              <p className="text-[9px] text-brand-muted italic">"Small choices. Visible impact."</p>
              
              <button
                onClick={handleShare}
                className="mt-2 w-full flex items-center justify-center gap-2 font-bold text-xs bg-brand-green text-brand-bg py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-green/20 transition-all duration-300"
              >
                <Download className="w-3.5 h-3.5" />
                {copied ? "Copied text summary!" : "Share / Export Card"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
