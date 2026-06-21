"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DailyEntry } from "../../types";
import { 
  calculateTravelEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission, 
  calculateShoppingEmission, 
  calculateWasteEmission 
} from "../../lib/carbonCalculator";

interface CategoryBreakdownProps {
  entries: DailyEntry[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ entries }) => {
  // If no entries, show empty state
  if (!entries || entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-brand-muted">
        No tracking data available.
      </div>
    );
  }

  // Aggregate emissions by category across all entries
  let travelSum = 0;
  let foodSum = 0;
  let energySum = 0;
  let shoppingSum = 0;
  let wasteSum = 0;

  entries.forEach((e) => {
    travelSum += calculateTravelEmission(e.travel.mode, e.travel.distance, e.travel.trips);
    foodSum += calculateFoodEmission(e.food.mealType, e.food.delivery);
    energySum += calculateEnergyEmission(
      e.energy.acHours,
      e.energy.fanHours,
      e.energy.lightsUsage,
      e.energy.devicesCharged,
      e.energy.usageStyle
    );
    shoppingSum += calculateShoppingEmission(e.shopping.type);
    wasteSum += calculateWasteEmission(e.waste);
  });

  const totalEmissions = travelSum + foodSum + energySum + shoppingSum + wasteSum;

  const data = [
    { name: "Travel", value: Number(travelSum.toFixed(1)), color: "#22D3EE" },
    { name: "Food", value: Number(foodSum.toFixed(1)), color: "#FACC15" },
    { name: "Energy", value: Number(energySum.toFixed(1)), color: "#F87171" },
    { name: "Shopping", value: Number(shoppingSum.toFixed(1)), color: "#A7F3D0" },
    { name: "Waste", value: Number(wasteSum.toFixed(1)), color: "#4ADE80" },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const pct = totalEmissions > 0 ? ((val / totalEmissions) * 100).toFixed(1) : "0";
      return (
        <div className="glass-card rounded-xl p-2.5 border border-white/10 text-xs shadow-xl">
          <p className="font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-brand-text font-semibold mt-0.5">{val} kg CO₂e</p>
          <p className="text-[10px] text-brand-muted">{pct}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[200px]">
      {/* Pie Chart */}
      <div className="relative w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: "none" }} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider leading-none">Total</span>
          <span className="text-lg font-extrabold text-brand-text mt-1 leading-none">
            {totalEmissions.toFixed(0)} <span className="text-xs font-semibold text-brand-muted">kg</span>
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex-1 space-y-2.5 w-full">
        {data.map((item, idx) => {
          const pct = totalEmissions > 0 ? ((item.value / totalEmissions) * 100).toFixed(0) : "0";
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-brand-text font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-muted">{item.value} kg</span>
                <span className="font-bold text-brand-text w-8 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="text-xs text-brand-muted italic py-4">All values are zero. Add travel or food activity to see your breakdown.</div>
        )}
      </div>
    </div>
  );
};
