"use client";

import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from "recharts";
import { DailyEntry } from "../../types";

interface FootprintChartProps {
  data: DailyEntry[];
}

export const FootprintChart: React.FC<FootprintChartProps> = ({ data }) => {
  // Format dates to Day names (Mon, Tue, etc.)
  const chartData = [...data].reverse().map(entry => {
    const dayName = new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" });
    return {
      name: dayName,
      co2: entry.totalCO2e,
      score: entry.greenScore
    };
  });

  // Custom tooltips matching dark-glass theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl p-3 border border-white/10 text-xs shadow-xl space-y-1">
          <p className="font-bold text-brand-text mb-1">{payload[0].payload.name}</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-brand-cyan" />
            <span className="text-brand-muted">Footprint: </span>
            <span className="font-bold text-brand-text">{payload[0].value} kg CO₂e</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-brand-green" />
            <span className="text-brand-muted">Score: </span>
            <span className="font-bold text-brand-green">{payload[0].payload.score}/100</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-8}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: 1 }} />
          <Area 
            type="monotone" 
            dataKey="co2" 
            stroke="#22D3EE" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCo2)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
