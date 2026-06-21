"use client";

import React from "react";
import { CheckCircle2, Circle, Flame, Sparkles } from "lucide-react";
import { Action } from "../../types";

interface ActionCardProps {
  action: Action;
  onToggle: (id: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onToggle }) => {
  const getDifficultyStyles = (diff: Action["difficulty"]) => {
    switch (diff) {
      case "Easy":
        return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case "Medium":
        return "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20";
      case "Hard":
        return "bg-brand-red/10 text-brand-red border-brand-red/20";
      default:
        return "bg-white/5 text-brand-muted border-white/5";
    }
  };

  return (
    <div 
      className={`glass-card rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden ${
        action.completed 
          ? "border-brand-green/30 bg-brand-green/[0.02] shadow-lg shadow-brand-green/5" 
          : "border-brand-border hover:border-white/10"
      }`}
    >
      <div className="flex gap-4 items-start">
        {/* Toggle Button */}
        <button
          onClick={() => onToggle(action.id)}
          className={`mt-0.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
            action.completed ? "text-brand-green" : "text-brand-muted hover:text-brand-text"
          }`}
        >
          {action.completed ? (
            <CheckCircle2 className="w-5 h-5 fill-brand-green/10 stroke-[2.5]" />
          ) : (
            <Circle className="w-5 h-5 stroke-[1.8]" />
          )}
        </button>

        {/* Core details */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 
              className={`text-sm font-semibold transition-all duration-300 ${
                action.completed ? "text-brand-muted line-through" : "text-brand-text"
              }`}
            >
              {action.title}
            </h4>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyStyles(action.difficulty)}`}>
              {action.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-brand-muted">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Saves {action.estimatedCarbonSaved} kg CO₂e</span>
            </div>
            {action.estimatedMoneySaved > 0 && (
              <div className="flex items-center gap-1 border-l border-brand-border pl-3">
                <span className="text-brand-green font-semibold">₹{action.estimatedMoneySaved}</span>
                <span>saved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glow highlight */}
      {action.completed && (
        <div className="absolute right-0 bottom-0 top-0 w-[4px] bg-brand-green" />
      )}
    </div>
  );
};
