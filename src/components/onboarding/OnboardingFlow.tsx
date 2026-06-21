"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  MapPin, 
  Users, 
  Car, 
  Flame,
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Leaf,
  Droplet,
  Tv,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { calculateDailyTotal, calculateGreenScore } from "../../lib/carbonCalculator";

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [householdSize, setHouseholdSize] = useState<number>(1);
  
  const [commuteMode, setCommuteMode] = useState("car");
  const [commuteDistance, setCommuteDistance] = useState<number>(10);
  
  const [diet, setDiet] = useState("Mixed diet");
  const [delivery, setDelivery] = useState("1–2 times/week");
  
  const [acUsage, setAcUsage] = useState("3–5 hours/day");
  const [electricityStyle, setElectricityStyle] = useState("Moderate");
  
  const [shoppingFreq, setShoppingFreq] = useState("Weekly");
  const [reusables, setReusables] = useState("Yes");

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      triggerCalculation();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const triggerCalculation = () => {
    setCalculating(true);
    setError("");
    setTimeout(async () => {
      try {
        await completeOnboarding(
          name || "Anish",
          city || "Bengaluru",
          householdSize,
          commuteMode,
          commuteDistance,
          diet,
          electricityStyle,
          shoppingFreq,
          reusables === "Yes"
        );
        // Wait for state storage and trigger full reload to avoid context mismatches
        window.location.href = "/dashboard";
      } catch (err: any) {
        console.error("Onboarding failed:", err);
        setError(err?.message || "Failed to save profile. Please verify your connection and try again.");
        setCalculating(false);
      }
    }, 2800);
  };

  // Helper validation
  const isStepDisabled = () => {
    if (step === 1) {
      return !name.trim() || !city.trim();
    }
    return false;
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-card rounded-3xl border border-brand-border p-6 md:p-8 relative overflow-hidden shadow-2xl">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-green/45 to-transparent" />
      
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-200 whitespace-pre-line leading-relaxed">
          ⚠️ {error}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {calculating ? (
          <motion.div 
            key="calculating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 rounded-full border-2 border-brand-green/20 border-t-brand-green flex items-center justify-center"
              />
              <Leaf className="w-6 h-6 text-brand-green absolute top-5 left-5 glow-green" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Analyzing your climate footprint...</h3>
            <p className="text-brand-muted text-sm max-w-sm">
              Cross-referencing habits in {city} with localized emission factors across food, energy, transport, and waste patterns.
            </p>
            
            {/* Loading micro-animation bars */}
            <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden mt-6 relative">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-1/2 bg-brand-green"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-brand-green uppercase tracking-widest font-semibold bg-brand-green/10 px-2.5 py-1 rounded-md border border-brand-green/10">
                Step {step} of {totalSteps}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-1 rounded-full transition-all duration-300 ${
                      i + 1 <= step ? "bg-brand-green" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-brand-text">Let's create your profile</h2>
                  <p className="text-brand-muted text-sm mt-1">We customize calculations using your location and household needs.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="onboarding-name-input" className="text-xs text-brand-muted font-semibold block mb-1.5">WHAT IS YOUR NAME?</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-muted" />
                      <input 
                        id="onboarding-name-input"
                        type="text" 
                        placeholder="e.g. Anish" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-secondary/60 border border-brand-border rounded-xl py-3 pl-11 pr-4 text-brand-text focus:outline-none focus:border-brand-green/50 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="onboarding-city-input" className="text-xs text-brand-muted font-semibold block mb-1.5">WHICH CITY DO YOU LIVE IN?</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-muted" />
                      <input 
                        id="onboarding-city-input"
                        type="text" 
                        placeholder="e.g. Bengaluru" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-brand-secondary/60 border border-brand-border rounded-xl py-3 pl-11 pr-4 text-brand-text focus:outline-none focus:border-brand-green/50 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">HOUSEHOLD SIZE (PEOPLE)</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          aria-pressed={householdSize === num}
                          onClick={() => setHouseholdSize(num)}
                          className={`py-3 rounded-xl border font-semibold text-sm transition-all duration-300 ${
                            householdSize === num 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {num === 5 ? "5+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Transport */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-brand-text">Commute & Travel</h2>
                  <p className="text-brand-muted text-sm mt-1">Commutes are often the single largest emissions driver.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">DAILY COMMUTE MODE</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "walk", label: "Walk" },
                        { id: "cycle", label: "Cycle" },
                        { id: "metro", label: "Metro" },
                        { id: "bus", label: "Bus" },
                        { id: "bike", label: "Bike" },
                        { id: "car", label: "Car" },
                        { id: "cab", label: "Cab" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={commuteMode === item.id}
                          onClick={() => setCommuteMode(item.id)}
                          className={`py-3 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                            commuteMode === item.id 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="onboarding-distance-input" className="text-xs text-brand-muted font-semibold block">DAILY TRAVEL DISTANCE</label>
                      <span className="text-sm font-bold text-brand-green">{commuteDistance} km</span>
                    </div>
                    <input 
                      id="onboarding-distance-input"
                      type="range" 
                      min="1" 
                      max="100" 
                      value={commuteDistance}
                      onChange={(e) => setCommuteDistance(Number(e.target.value))}
                      className="w-full accent-brand-green"
                    />
                    <div className="flex justify-between text-[10px] text-brand-muted mt-1">
                      <span>1 km</span>
                      <span>50 km</span>
                      <span>100 km+</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Food */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-brand-text">Diet & Food Habits</h2>
                  <p className="text-brand-muted text-sm mt-1">Agricultural production styles yield very different footprint totals.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">DIET TYPE</label>
                    <div className="space-y-2">
                      {[
                        { label: "Vegan", desc: "100% plant-based food" },
                        { label: "Mostly vegetarian", desc: "No meat, occasional dairy" },
                        { label: "Dairy-heavy", desc: "Vegetarian with frequent cheese, butter" },
                        { label: "Mixed diet", desc: "Blend of meat, fish, vegetables" },
                        { label: "Non-vegetarian", desc: "Heavy meat intake (red meat/poultry)" }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          aria-pressed={diet === item.label}
                          onClick={() => setDiet(item.label)}
                          className={`w-full py-3 px-4 rounded-xl border text-left flex justify-between items-center transition-all duration-300 ${
                            diet === item.label 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          <div>
                            <span className="text-sm font-semibold block text-brand-text">{item.label}</span>
                            <span className="text-[11px] text-brand-muted block mt-0.5">{item.desc}</span>
                          </div>
                          {diet === item.label && <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">FOOD DELIVERY FREQUENCY</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Rarely", "1–2 times/week", "3–5 times/week", "Daily"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={delivery === option}
                          onClick={() => setDelivery(option)}
                          className={`py-3 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                            delivery === option 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Energy */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-brand-text">Energy Usage</h2>
                  <p className="text-brand-muted text-sm mt-1">Heating, cooling, and appliance styles drive domestic grids.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">AVERAGE AC USAGE</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["None", "1–2 hours/day", "3–5 hours/day", "6+ hours/day"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={acUsage === option}
                          onClick={() => setAcUsage(option)}
                          className={`py-3 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                            acUsage === option 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">ELECTRICITY USAGE LEVEL</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Low", desc: "Energy efficient appliances" },
                        { label: "Moderate", desc: "Standard household load" },
                        { label: "High", desc: "Heavy cooling, multiple electronics" }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          aria-pressed={electricityStyle === item.label}
                          onClick={() => setElectricityStyle(item.label)}
                          className={`py-3 px-2 rounded-xl border text-center flex flex-col items-center justify-center transition-all duration-300 ${
                            electricityStyle === item.label 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          <span className="text-sm font-semibold text-brand-text">{item.label}</span>
                          <span className="text-[9px] text-brand-muted mt-1 leading-tight">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Shopping & Waste */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-brand-text">Shopping & circularity</h2>
                  <p className="text-brand-muted text-sm mt-1">Consumer supply chain emissions can be mitigated through circular packaging habits.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">ONLINE SHOPPING FREQUENCY</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Rarely", "Monthly", "Weekly", "Often"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={shoppingFreq === option}
                          onClick={() => setShoppingFreq(option)}
                          className={`py-3 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                            shoppingFreq === option 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-brand-muted font-semibold block mb-2">CARRY A REUSABLE BOTTLE/BAG?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Yes", "Sometimes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={reusables === option}
                          onClick={() => setReusables(option)}
                          className={`py-3 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                            reusables === option 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-brand-border">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text font-semibold transition-colors py-2 px-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={isStepDisabled()}
                className={`flex items-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-xl border transition-all duration-300 ${
                  isStepDisabled()
                    ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                    : "bg-brand-green border-brand-green text-brand-bg hover:shadow-lg hover:shadow-brand-green/20"
                }`}
              >
                {step === totalSteps ? "Generate Profile" : "Continue"}
                {step === totalSteps ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
