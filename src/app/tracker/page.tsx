"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  ChefHat, 
  Tv, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Footprints,
  RotateCcw
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { calculateDailyTotal, calculateGreenScore } from "../../lib/carbonCalculator";

const CATEGORIES = [
  { id: "travel", label: "Travel", icon: Car },
  { id: "food", label: "Food", icon: ChefHat },
  { id: "energy", label: "Energy", icon: Tv },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "waste", label: "Waste", icon: Trash2 },
];

export default function Tracker() {
  const { entries, saveDailyEntry } = useApp();
  const [activeTab, setActiveTab] = useState("travel");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [date, setDate] = useState("");

  // Set default date to today
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Form states
  const [travelMode, setTravelMode] = useState("metro");
  const [travelDistance, setTravelDistance] = useState(15);
  const [travelTrips, setTravelTrips] = useState(2);

  const [foodMeal, setFoodMeal] = useState("vegetarian");
  const [foodDelivery, setFoodDelivery] = useState(false);

  const [energyAc, setEnergyAc] = useState(2);
  const [energyFan, setEnergyFan] = useState(6);
  const [energyLights, setEnergyLights] = useState(5);
  const [energyDevices, setEnergyDevices] = useState(3);
  const [energyStyle, setEnergyStyle] = useState("moderate");

  const [shoppingType, setShoppingType] = useState("none");

  const [wasteBottle, setWasteBottle] = useState(true);
  const [wastePlastic, setWastePlastic] = useState(false);
  const [wasteBag, setWasteBag] = useState(true);
  const [wasteFood, setWasteFood] = useState(false);
  const [wasteRecycling, setWasteRecycling] = useState(true);

  // Load existing entry values if user switches dates
  useEffect(() => {
    if (!date) return;
    const existing = entries.find((e) => e.date === date);
    if (existing) {
      setTravelMode(existing.travel.mode);
      setTravelDistance(existing.travel.distance);
      setTravelTrips(existing.travel.trips);

      setFoodMeal(existing.food.mealType);
      setFoodDelivery(existing.food.delivery);

      setEnergyAc(existing.energy.acHours);
      setEnergyFan(existing.energy.fanHours);
      setEnergyLights(existing.energy.lightsUsage);
      setEnergyDevices(existing.energy.devicesCharged);
      setEnergyStyle(existing.energy.usageStyle);

      setShoppingType(existing.shopping.type);

      setWasteBottle(existing.waste.reusableBottle);
      setWastePlastic(existing.waste.plasticBottleBought);
      setWasteBag(existing.waste.reusableBagUsed);
      setWasteFood(existing.waste.foodWaste);
      setWasteRecycling(existing.waste.recyclingDone);
    }
  }, [date, entries]);

  // Aggregate structures
  const travelEntry = { mode: travelMode, distance: travelDistance, trips: travelTrips };
  const foodEntry = { mealType: foodMeal, delivery: foodDelivery };
  const energyEntry = { acHours: energyAc, fanHours: energyFan, lightsUsage: energyLights, devicesCharged: energyDevices, usageStyle: energyStyle };
  const shoppingEntry = { type: shoppingType };
  const wasteEntry = { reusableBottle: wasteBottle, plasticBottleBought: wastePlastic, reusableBagUsed: wasteBag, foodWaste: wasteFood, recyclingDone: wasteRecycling };

  // Calculate live totals
  const liveCO2 = calculateDailyTotal(travelEntry, foodEntry, energyEntry, shoppingEntry, wasteEntry);
  const liveScore = calculateGreenScore(liveCO2);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyEntry(
      date,
      travelEntry,
      foodEntry,
      energyEntry,
      shoppingEntry,
      wasteEntry
    );
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const resetToday = () => {
    setTravelMode("walk");
    setTravelDistance(1);
    setTravelTrips(1);
    setFoodMeal("vegan");
    setFoodDelivery(false);
    setEnergyAc(0);
    setEnergyFan(4);
    setEnergyLights(4);
    setEnergyDevices(2);
    setEnergyStyle("low");
    setShoppingType("none");
    setWasteBottle(true);
    setWastePlastic(false);
    setWasteBag(true);
    setWasteFood(false);
    setWasteRecycling(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">Daily Footprint Tracker</h2>
        <p className="text-xs text-brand-muted mt-1">Log your activity details to update your climate analytics profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container */}
        <form onSubmit={handleSave} className="lg:col-span-8 glass-card rounded-2xl border border-brand-border p-5 md:p-6 space-y-6">
          
          {/* Header Row: Date selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <label htmlFor="tracking-date-input" className="text-xs text-brand-muted uppercase font-bold tracking-wider">Tracking Date</label>
              <input 
                id="tracking-date-input"
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="bg-brand-secondary/80 border border-brand-border rounded-xl px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
              />
            </div>
            
            <button
              type="button"
              onClick={resetToday}
              className="text-xs text-brand-muted hover:text-brand-text flex items-center gap-1 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Category Toggles
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-border/40 overflow-x-auto no-scrollbar gap-1.5 pb-2">
            {CATEGORIES.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isActive 
                      ? "bg-brand-green/10 border border-brand-green/25 text-brand-green" 
                      : "text-brand-muted hover:text-brand-text border border-transparent hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === "travel" && (
                <motion.div
                  key="travel"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">Transport Mode</label>
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
                          aria-pressed={travelMode === item.id}
                          onClick={() => setTravelMode(item.id)}
                          className={`py-3 rounded-xl border text-xs font-semibold transition-all ${
                            travelMode === item.id 
                              ? "bg-brand-green/10 border-brand-green text-brand-green" 
                              : "bg-brand-secondary/60 border-brand-border text-brand-muted hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="travel-distance-input" className="text-xs font-bold text-brand-muted uppercase tracking-wider">Distance (km)</label>
                        <span className="text-xs font-bold text-brand-cyan">{travelDistance} km</span>
                      </div>
                      <input 
                        id="travel-distance-input"
                        type="range" 
                        min="0" 
                        max="120" 
                        value={travelDistance}
                        onChange={(e) => setTravelDistance(Number(e.target.value))}
                        className="w-full accent-brand-cyan"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1.5">Number of Trips</label>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          aria-label="Decrease trips"
                          onClick={() => setTravelTrips(prev => Math.max(1, prev - 1))}
                          className="w-9 h-9 rounded-xl border border-brand-border bg-brand-secondary/60 text-brand-text flex items-center justify-center hover:bg-white/5 text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-brand-text w-6 text-center">{travelTrips}</span>
                        <button 
                          type="button" 
                          aria-label="Increase trips"
                          onClick={() => setTravelTrips(prev => prev + 1)}
                          className="w-9 h-9 rounded-xl border border-brand-border bg-brand-secondary/60 text-brand-text flex items-center justify-center hover:bg-white/5 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "food" && (
                <motion.div
                  key="food"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">Meal Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "vegan", label: "Vegan Meal" },
                        { id: "vegetarian", label: "Vegetarian Meal" },
                        { id: "dairy-heavy", label: "Dairy-Heavy Meal" },
                        { id: "chicken", label: "Chicken Meal" },
                        { id: "red-meat", label: "Red Meat/Mutton" },
                        { id: "fast-food", label: "Fast Food Burger" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={foodMeal === item.id}
                          onClick={() => setFoodMeal(item.id)}
                          className={`py-3 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                            foodMeal === item.id 
                              ? "bg-brand-yellow/10 border-brand-yellow text-brand-yellow" 
                              : "bg-brand-secondary/60 border-brand-border text-brand-muted hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-brand-border">
                    <div>
                      <h4 className="text-xs font-bold text-brand-text">Ordered Food Delivery?</h4>
                      <p className="text-[10px] text-brand-muted mt-0.5">Adds 0.5 kg for packaging transit footprint.</p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={foodDelivery}
                      onClick={() => setFoodDelivery(!foodDelivery)}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                        foodDelivery 
                          ? "bg-brand-yellow/15 border-brand-yellow/30 text-brand-yellow" 
                          : "bg-brand-secondary/60 border-brand-border text-brand-muted"
                      }`}
                    >
                      {foodDelivery ? "Yes, Ordered" : "No, Home Cooked"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "energy" && (
                <motion.div
                  key="energy"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="energy-ac-input" className="text-xs font-bold text-brand-muted uppercase tracking-wider">Air Conditioner (Hours)</label>
                        <span className="text-xs font-bold text-brand-red">{energyAc} hrs</span>
                      </div>
                      <input 
                        id="energy-ac-input"
                        type="range" 
                        min="0" 
                        max="24" 
                        value={energyAc}
                        onChange={(e) => setEnergyAc(Number(e.target.value))}
                        className="w-full accent-brand-red"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="energy-fan-input" className="text-xs font-bold text-brand-muted uppercase tracking-wider">Electric Fan (Hours)</label>
                        <span className="text-xs font-bold text-brand-text">{energyFan} hrs</span>
                      </div>
                      <input 
                        id="energy-fan-input"
                        type="range" 
                        min="0" 
                        max="24" 
                        value={energyFan}
                        onChange={(e) => setEnergyFan(Number(e.target.value))}
                        className="w-full accent-brand-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="energy-lights-input" className="text-xs font-bold text-brand-muted uppercase tracking-wider">Lights & Bulbs (Hours)</label>
                        <span className="text-xs font-bold text-brand-text">{energyLights} hrs</span>
                      </div>
                      <input 
                        id="energy-lights-input"
                        type="range" 
                        min="0" 
                        max="24" 
                        value={energyLights}
                        onChange={(e) => setEnergyLights(Number(e.target.value))}
                        className="w-full accent-brand-muted"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="energy-devices-input" className="text-xs font-bold text-brand-muted uppercase tracking-wider">Devices Charged (Count)</label>
                        <span className="text-xs font-bold text-brand-text">{energyDevices} devices</span>
                      </div>
                      <input 
                        id="energy-devices-input"
                        type="range" 
                        min="0" 
                        max="15" 
                        value={energyDevices}
                        onChange={(e) => setEnergyDevices(Number(e.target.value))}
                        className="w-full accent-brand-muted"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">Electricity Load Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["low", "moderate", "high"].map((style) => (
                        <button
                          key={style}
                          type="button"
                          aria-pressed={energyStyle === style}
                          onClick={() => setEnergyStyle(style)}
                          className={`py-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                            energyStyle === style 
                              ? "bg-brand-red/10 border-brand-red text-brand-red" 
                              : "bg-brand-secondary/60 border-brand-border text-brand-muted hover:bg-white/5"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "shopping" && (
                <motion.div
                  key="shopping"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">Purchase Type Today</label>
                  <div className="space-y-2">
                    {[
                      { id: "none", label: "No purchases", desc: "Eco-friendly zero consumption day" },
                      { id: "small-online", label: "Small Online Delivery", desc: "Adds packaging cardboard and freight transit" },
                      { id: "clothing", label: "New Clothing / Garment", desc: "Fibers and dyes supply chain carbon load" },
                      { id: "electronics", label: "Gadget / Electronics", desc: "High manufacturing extraction cost" },
                      { id: "reused", label: "Circular Thrift / Reused item", desc: "Circular economy offset of -1.5 kg" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={shoppingType === item.id}
                        onClick={() => setShoppingType(item.id)}
                        className={`w-full py-3.5 px-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          shoppingType === item.id 
                            ? "bg-brand-mint/10 border-brand-mint text-brand-mint" 
                            : "bg-brand-secondary/60 border-brand-border text-brand-muted hover:bg-white/5"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-semibold block text-brand-text">{item.label}</span>
                          <span className="text-[11px] text-brand-muted block mt-0.5">{item.desc}</span>
                        </div>
                        {shoppingType === item.id && <span className="text-[10px] font-bold text-brand-mint uppercase bg-brand-mint/10 px-2 py-0.5 rounded">Selected</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "waste" && (
                <motion.div
                  key="waste"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">Circular Choices & Waste Toggles</label>
                  
                  {[
                    { state: wasteBottle, setState: setWasteBottle, title: "Used Reusable Bottle", desc: "Reduces single-use plastic demands", isOffset: true },
                    { state: wastePlastic, setState: setWastePlastic, title: "Bought Plastic Water Bottle", desc: "Adds landfill microplastics load", isOffset: false },
                    { state: wasteBag, setState: setWasteBag, title: "Used Reusable Grocery Bag", desc: "Lowers synthetic bag consumption", isOffset: true },
                    { state: wasteFood, setState: setWasteFood, title: "Wasted Uneaten Food Scraps", desc: "Creates greenhouse methane gases", isOffset: false },
                    { state: wasteRecycling, setState: setWasteRecycling, title: "Sorted Recycling / Compost", desc: "Diverts items away from landfills", isOffset: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-white/5 border border-brand-border rounded-xl">
                      <div>
                        <h4 className="text-xs font-semibold text-brand-text">{item.title}</h4>
                        <p className="text-[10px] text-brand-muted mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={item.state}
                        onClick={() => item.setState(!item.state)}
                        className={`text-xs font-bold px-4 py-1.5 rounded-xl border transition-all ${
                          item.state 
                            ? item.isOffset 
                              ? "bg-brand-green/10 border-brand-green/30 text-brand-green" 
                              : "bg-brand-red/10 border-brand-red/30 text-brand-red"
                            : "bg-brand-secondary/60 border-brand-border text-brand-muted"
                        }`}
                      >
                        {item.state ? "True" : "False"}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Row */}
          <div className="pt-4 border-t border-brand-border flex items-center justify-between">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-brand-green font-semibold"
                >
                  <CheckCircle className="w-4 h-4" />
                  Entry saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              type="submit"
              className="ml-auto flex items-center gap-2 font-bold text-xs bg-brand-green text-brand-bg py-2.5 px-6 rounded-xl hover:shadow-lg hover:shadow-brand-green/20 transition duration-300"
            >
              Save Tracker Entry
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

        {/* Live Estimator Sidebar widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-5">
            <div>
              <h3 className="text-xs uppercase font-bold text-brand-muted tracking-wider">Live Analysis</h3>
              <p className="text-[10px] text-brand-muted mt-0.5">Estimated footprint for the selected toggles</p>
            </div>

            <div className="space-y-4 text-center py-2">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl inline-block w-full">
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">Est. Footprint</span>
                <span className="text-3xl font-extrabold text-brand-cyan glow-cyan mt-1 block">
                  {liveCO2} <span className="text-xs font-semibold text-brand-muted">kg CO₂e</span>
                </span>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl inline-block w-full">
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">Est. Green Score</span>
                <span className="text-3xl font-extrabold text-brand-green glow-green mt-1 block">
                  {liveScore}<span className="text-xs font-semibold text-brand-muted">/100</span>
                </span>
              </div>
            </div>

            <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-brand-green" />
                <span className="text-[10px] uppercase font-bold text-brand-green tracking-wider">Real-time Calculation</span>
              </div>
              <p className="text-[11px] text-brand-muted leading-relaxed">
                As you slide and select options, these figures recalculate immediately using local carbon emission factors. Hit save to commit changes to your weekly trends chart.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
