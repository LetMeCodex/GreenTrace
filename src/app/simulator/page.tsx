"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  HelpCircle, 
  TrendingDown, 
  ChevronRight, 
  Car, 
  ChefHat, 
  Tv, 
  ShoppingBag,
  DollarSign
} from "lucide-react";
import { MOCK_SIMULATOR_SCENARIOS } from "../../lib/mockData";

export default function Simulator() {
  const [selectedPreset, setSelectedPreset] = useState(MOCK_SIMULATOR_SCENARIOS[0]);
  
  // Custom travel inputs
  const [distance, setDistance] = useState(15);
  const [currentMode, setCurrentMode] = useState("car");
  const [betterMode, setBetterMode] = useState("metro");

  // Custom energy inputs
  const [acHours, setAcHours] = useState(6);
  const [acTemp, setAcTemp] = useState(20);
  const [acBetterHours, setAcBetterHours] = useState(3);
  const [acBetterTemp, setAcBetterTemp] = useState(25);

  const [activeCategory, setActiveCategory] = useState("presets");

  // Travel factors
  const travelFactors: Record<string, number> = {
    walk: 0,
    cycle: 0,
    metro: 0.04,
    bus: 0.08,
    bike: 0.10,
    car: 0.21,
    cab: 0.25
  };

  const travelCosts: Record<string, number> = {
    walk: 0,
    cycle: 0,
    metro: 2.5, // INR/km
    bus: 3.0,
    bike: 5.0,
    car: 12.0,
    cab: 25.0
  };

  // Preset calculation getters
  const presetSavedCo2 = Number((selectedPreset.currentCo2 - selectedPreset.betterCo2).toFixed(2));
  const presetSavedMoney = selectedPreset.currentMoney - selectedPreset.betterMoney;
  const presetPctRatio = Math.round((selectedPreset.betterCo2 / selectedPreset.currentCo2) * 100);

  // Custom Travel calculations
  const currentTravelCo2 = Number((distance * (travelFactors[currentMode] || 0.2)).toFixed(2));
  const betterTravelCo2 = Number((distance * (travelFactors[betterMode] || 0.04)).toFixed(2));
  const customTravelSavedCo2 = Number(Math.max(0, currentTravelCo2 - betterTravelCo2).toFixed(2));
  
  const currentTravelCost = distance * (travelCosts[currentMode] || 15);
  const betterTravelCost = distance * (travelCosts[betterMode] || 3);
  const customTravelSavedMoney = Math.max(0, currentTravelCost - betterTravelCost);

  // Custom AC calculations
  // Base AC consumption: ~1.5 kW. 1 kW AC at 20°C runs compressor 90% of time -> 1.35 kWh -> ~1.1 kg CO2/hr
  // At 25°C runs compressor 50% of time -> 0.75 kWh -> ~0.6 kg CO2/hr
  const acCurrentFactor = acTemp < 22 ? 1.2 : acTemp < 24 ? 0.9 : 0.6;
  const acBetterFactor = acBetterTemp < 22 ? 1.2 : acBetterTemp < 24 ? 0.9 : 0.6;

  const currentAcCo2 = Number((acHours * acCurrentFactor).toFixed(2));
  const betterAcCo2 = Number((acBetterHours * acBetterFactor).toFixed(2));
  const customAcSavedCo2 = Number(Math.max(0, currentAcCo2 - betterAcCo2).toFixed(2));

  const currentAcCost = Math.round(acHours * acCurrentFactor * 12); // ~12 INR per unit
  const betterAcCost = Math.round(acBetterHours * acBetterFactor * 12);
  const customAcSavedMoney = Math.max(0, currentAcCost - betterAcCost);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">What-If Simulator</h2>
        <p className="text-xs text-brand-muted mt-1">Compare alternate lifestyle choices side-by-side to optimize carbon savings and expenses.</p>
      </div>

      {/* Simulator modes */}
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-brand-border">
        <button
          onClick={() => setActiveCategory("presets")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
            activeCategory === "presets" 
              ? "bg-brand-green/10 border-brand-green text-brand-green" 
              : "border-transparent text-brand-muted hover:text-brand-text hover:bg-white/5"
          }`}
        >
          Preset Scenarios
        </button>
        
        <button
          onClick={() => setActiveCategory("custom-travel")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
            activeCategory === "custom-travel" 
              ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan" 
              : "border-transparent text-brand-muted hover:text-brand-text hover:bg-white/5"
          }`}
        >
          Custom Commute Builder
        </button>

        <button
          onClick={() => setActiveCategory("custom-ac")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
            activeCategory === "custom-ac" 
              ? "bg-brand-red/10 border-brand-red text-brand-red" 
              : "border-transparent text-brand-muted hover:text-brand-text hover:bg-white/5"
          }`}
        >
          Custom AC Configurator
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Simulation Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Preset Selector */}
          {activeCategory === "presets" && (
            <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-4">
              <h3 className="text-sm font-bold text-brand-text">Select Scenario Preset</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOCK_SIMULATOR_SCENARIOS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isSelected 
                          ? "bg-brand-green/10 border-brand-green/40 text-brand-text shadow-md shadow-brand-green/5" 
                          : "bg-brand-secondary/60 border-brand-border text-brand-muted hover:bg-white/5"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {preset.category === "travel" && <Car className="w-4 h-4 text-brand-cyan" />}
                        {preset.category === "food" && <ChefHat className="w-4 h-4 text-brand-yellow" />}
                        {preset.category === "energy" && <Tv className="w-4 h-4 text-brand-red" />}
                        {preset.category === "shopping" && <ShoppingBag className="w-4 h-4 text-brand-mint" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">{preset.title}</span>
                        <span className="text-[10px] text-brand-muted block mt-0.5 truncate max-w-[180px]">
                          {preset.currentLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 mt-2">
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Context & Info</span>
                <p className="text-[11.5px] text-brand-muted leading-relaxed">{selectedPreset.explanation}</p>
              </div>
            </div>
          )}

          {/* Custom Travel Builder */}
          {activeCategory === "custom-travel" && (
            <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-brand-text">Custom Commute Calculator</h3>
                <p className="text-[10px] text-brand-muted mt-0.5">Toggle transit modes and slide distances to measure carbon impact difference.</p>
              </div>

              <div className="space-y-4">
                {/* Distance slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Commute Distance</label>
                    <span className="text-sm font-extrabold text-brand-cyan">{distance} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={distance} 
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full accent-brand-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Current Choice</label>
                    <select
                      value={currentMode}
                      onChange={(e) => setCurrentMode(e.target.value)}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl p-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-cyan/45"
                    >
                      <option value="car">Car (Single occupancy)</option>
                      <option value="cab">Cab / Taxi Ride</option>
                      <option value="bike">Motorcycle / Scooter</option>
                      <option value="bus">Standard City Bus</option>
                    </select>
                  </div>

                  {/* Better Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Alternative Choice</label>
                    <select
                      value={betterMode}
                      onChange={(e) => setBetterMode(e.target.value)}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl p-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    >
                      <option value="metro">Electric Metro Transit</option>
                      <option value="bus">Standard City Bus</option>
                      <option value="cycle">Pedal Cycling</option>
                      <option value="walk">Walking</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom AC Configurator */}
          {activeCategory === "custom-ac" && (
            <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-brand-text">AC Climate Optimization</h3>
                <p className="text-[10px] text-brand-muted mt-0.5 font-medium">Small cooling changes yield large grid load reductions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Current choice */}
                <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Current Setting</span>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-brand-muted">AC Usage Hours</label>
                      <span className="text-xs font-bold text-brand-text">{acHours} hrs</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      value={acHours} 
                      onChange={(e) => setAcHours(Number(e.target.value))}
                      className="w-full accent-brand-red"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-brand-muted">AC Temperature</label>
                      <span className="text-xs font-bold text-brand-text">{acTemp}°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="16" 
                      max="30" 
                      value={acTemp} 
                      onChange={(e) => setAcTemp(Number(e.target.value))}
                      className="w-full accent-brand-red"
                    />
                  </div>
                </div>

                {/* Better choice */}
                <div className="space-y-4 p-4 rounded-xl bg-brand-green/5 border border-brand-green/10">
                  <span className="text-xs font-bold text-brand-green uppercase tracking-wider">Alternative Config</span>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-brand-green/85">AC Usage Hours</label>
                      <span className="text-xs font-bold text-brand-text">{acBetterHours} hrs</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="12" 
                      value={acBetterHours} 
                      onChange={(e) => setAcBetterHours(Number(e.target.value))}
                      className="w-full accent-brand-green"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-brand-green/85">AC Temperature</label>
                      <span className="text-xs font-bold text-brand-text">{acBetterTemp}°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="16" 
                      max="30" 
                      value={acBetterTemp} 
                      onChange={(e) => setAcBetterTemp(Number(e.target.value))}
                      className="w-full accent-brand-green"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Comparison Diagnostics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-6 relative overflow-hidden">
            {/* Top Glow bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-cyan to-brand-green" />
            
            <div>
              <h3 className="text-xs uppercase font-bold text-brand-muted tracking-wider">Comparison Diagnostics</h3>
              <p className="text-[10px] text-brand-muted mt-0.5">Calculated difference in carbon output and expense</p>
            </div>

            {/* Side by Side Bar indicator */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-brand-muted font-medium">
                <span>Carbon Load comparison</span>
                <span>kg CO₂e</span>
              </div>
              
              <div className="space-y-2">
                {/* Current */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-brand-muted">
                    <span className="truncate max-w-[180px]">
                      {activeCategory === "presets" ? selectedPreset.currentLabel : activeCategory === "custom-travel" ? `${currentMode} ride` : `AC at ${acTemp}°C`}
                    </span>
                    <span className="font-bold text-brand-text">
                      {activeCategory === "presets" ? selectedPreset.currentCo2 : activeCategory === "custom-travel" ? currentTravelCo2 : currentAcCo2} kg
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-red h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Better */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-brand-muted">
                    <span className="truncate max-w-[180px] text-brand-green">
                      {activeCategory === "presets" ? selectedPreset.betterLabel : activeCategory === "custom-travel" ? `${betterMode} transit` : `AC at ${acBetterTemp}°C`}
                    </span>
                    <span className="font-bold text-brand-green">
                      {activeCategory === "presets" ? selectedPreset.betterCo2 : activeCategory === "custom-travel" ? betterTravelCo2 : betterAcCo2} kg
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-brand-green h-full rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${
                          activeCategory === "presets" 
                            ? presetPctRatio 
                            : activeCategory === "custom-travel" 
                              ? Math.round((betterTravelCo2 / Math.max(1, currentTravelCo2)) * 100) 
                              : Math.round((betterAcCo2 / Math.max(1, currentAcCo2)) * 100)
                        }%` 
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Savings stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/10 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">Carbon Saved</span>
                <span className="text-xl font-extrabold text-brand-cyan glow-cyan block mt-1">
                  {activeCategory === "presets" ? presetSavedCo2 : activeCategory === "custom-travel" ? customTravelSavedCo2 : customAcSavedCo2} kg
                </span>
              </div>

              <div className="p-3 bg-brand-green/5 border border-brand-green/10 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">Money Saved</span>
                <span className="text-xl font-extrabold text-brand-green glow-green block mt-1">
                  ₹{activeCategory === "presets" ? presetSavedMoney : activeCategory === "custom-travel" ? Math.round(customTravelSavedMoney) : customAcSavedMoney}
                </span>
              </div>
            </div>

            {/* Green Score Impact Pill */}
            <div className="p-4 bg-white/5 border border-brand-border rounded-xl space-y-1.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">Green Score Boost</span>
                <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                  Choosing this alternative would increase today's Green Score by
                </p>
              </div>
              <div className="px-3.5 py-2.5 bg-brand-green/10 border border-brand-green/20 rounded-xl text-brand-green text-center shrink-0">
                <span className="text-lg font-extrabold block">
                  +{activeCategory === "presets" 
                    ? Math.round(presetSavedCo2 * 6.5) 
                    : activeCategory === "custom-travel" 
                      ? Math.round(customTravelSavedCo2 * 6.5) 
                      : Math.round(customAcSavedCo2 * 6.5)
                  }
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider block">pts</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
