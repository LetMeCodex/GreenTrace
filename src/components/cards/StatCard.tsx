import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  iconColor: string;
  glowColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor,
  glowColor = "rgba(74, 222, 128, 0.15)"
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-brand-border flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg">
      {/* Top line gradient glow */}
      <div 
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${iconColor}, transparent)` }}
      />
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">
            {title}
          </span>
          <h3 className="text-2xl font-extrabold text-brand-text leading-tight mt-1">
            {value}
          </h3>
        </div>
        <div 
          className="p-2.5 rounded-xl border flex items-center justify-center shrink-0"
          style={{ 
            backgroundColor: `${iconColor}15`, 
            borderColor: `${iconColor}25`, 
            boxShadow: `0 0 10px ${iconColor}10` 
          }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brand-border flex items-center text-xs text-brand-muted">
        <span>{subtext}</span>
      </div>
    </div>
  );
};
