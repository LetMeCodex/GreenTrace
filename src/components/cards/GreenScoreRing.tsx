"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GreenScoreRingProps {
  score: number;
}

export const GreenScoreRing: React.FC<GreenScoreRingProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(score);
  }, [score]);

  // Radius: 45, Circumference: 2 * Math.PI * 45 ≈ 282.74
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  // Determine colors based on score
  const getScoreInfo = (val: number) => {
    if (val >= 80) return { color: "#4ADE80", text: "Excellent", bg: "rgba(74, 222, 128, 0.1)" };
    if (val >= 60) return { color: "#A7F3D0", text: "Good", bg: "rgba(167, 243, 208, 0.1)" };
    if (val >= 40) return { color: "#FACC15", text: "Fair", bg: "rgba(250, 204, 21, 0.1)" };
    return { color: "#F87171", text: "Critical", bg: "rgba(248, 113, 113, 0.1)" };
  };

  const scoreInfo = getScoreInfo(score);

  return (
    <div className="glass-card rounded-2xl p-5 border border-brand-border flex flex-col items-center justify-center text-center h-full relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg">
      <div 
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${scoreInfo.color}, transparent)` }}
      />
      
      <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider mb-4 block">
        Green Score
      </span>

      {/* SVG Ring Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Base circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          {/* Animated score circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className="fill-none"
            stroke={scoreInfo.color}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-extrabold text-brand-text leading-none"
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-brand-muted font-medium mt-1">/ 100</span>
        </div>
      </div>

      <div className="mt-4">
        <span 
          className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ backgroundColor: scoreInfo.bg, color: scoreInfo.color }}
        >
          {scoreInfo.text}
        </span>
        <p className="text-[10px] text-brand-muted mt-2">
          {score >= 80 
            ? "Outstanding choices. Keep up the clean lifestyle!" 
            : score >= 60 
            ? "On the right track, but transport or diet can improve."
            : score >= 40
            ? "Higher emissions. Switch to metro or plants to boost score."
            : "High carbon footprint. Try completing a few daily actions today."
          }
        </p>
      </div>
    </div>
  );
};
