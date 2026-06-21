"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import { calculateTravelEmission, calculateFoodEmission, calculateEnergyEmission, calculateShoppingEmission, calculateWasteEmission } from "../../lib/carbonCalculator";

export default function Dashboard() {
  const { user, entries, actions, challenges } = useApp();

  const userName = user ? user.name : "Anish";

  // Check if today's entry exists
  const todayDateStr = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find((e) => e.date === todayDateStr);
  const hasTodayEntry = !!todayEntry;

  // Use fallback values if no today entry, but mark clearly
  const todayFootprint = todayEntry ? todayEntry.totalCO2e : 0;
  const todayScore = todayEntry ? todayEntry.greenScore : 100;

  // Calculate averages across historical entries
  const averageFootprint = entries.length > 0
    ? Number((entries.reduce((sum, e) => sum + e.totalCO2e, 0) / entries.length).toFixed(1))
    : 8.5;

  const pctDiff = averageFootprint > 0 
    ? Math.round(((averageFootprint - todayFootprint) / averageFootprint) * 100)
    : 0;

  const diffText = pctDiff >= 0 
    ? `${pctDiff}% lower than your weekly average` 
    : `${Math.abs(pctDiff)}% higher than your weekly average`;

  const comparisonCopy = todayFootprint <= averageFootprint 
    ? `${userName}, your footprint is lighter than average.` 
    : `${userName}, your footprint is heavier than average.`;

  // Calculate dynamic savings
  const completedActions = actions.filter((a) => a.completed);
  const carbonSavedActions = Number(completedActions.reduce((sum, a) => sum + a.estimatedCarbonSaved, 0).toFixed(1));
  const weeklySaved = Number((carbonSavedActions + 4.2).toFixed(1));
  const monthlySaved = Number((carbonSavedActions + 18.6).toFixed(1));

  // Determine biggest source today
  const getBiggestSource = () => {
    if (!todayEntry) return { category: "Transport", percent: 0 };
    
    const travel = calculateTravelEmission(todayEntry.travel.mode, todayEntry.travel.distance, todayEntry.travel.trips);
    const food = calculateFoodEmission(todayEntry.food.mealType, todayEntry.food.delivery);
    const energy = calculateEnergyEmission(
      todayEntry.energy.acHours,
      todayEntry.energy.fanHours,
      todayEntry.energy.lightsUsage,
      todayEntry.energy.devicesCharged,
      todayEntry.energy.usageStyle
    );
    const shopping = calculateShoppingEmission(todayEntry.shopping.type);
    const waste = calculateWasteEmission(todayEntry.waste);

    const max = Math.max(travel, food, energy, shopping, waste);
    const total = travel + food + energy + shopping + waste;
    const pct = total > 0 ? Math.round((max / total) * 100) : 0;

    if (max === travel) return { category: "Transport", percent: pct };
    if (max === food) return { category: "Food & Diet", percent: pct };
    if (max === energy) return { category: "Home Utility", percent: pct };
    if (max === shopping) return { category: "Shopping", percent: pct };
    return { category: "Waste & Bottles", percent: pct };
  };

  const biggestSource = getBiggestSource();

  // Dynamic Weekly Carbon Plan generator based on biggest source category
  const getDynamicPlan = (category: string) => {
    switch (category) {
      case "Transport":
        return [
          { day: "Monday", action: "Use metro instead of car/bike", saving: "1.2 kg CO₂e" },
          { day: "Tuesday", action: "Carpool with colleague", saving: "0.8 kg CO₂e" },
          { day: "Wednesday", action: "Walk for trips under 2 km", saving: "0.5 kg CO₂e" },
          { day: "Thursday", action: "Combine multiple errands", saving: "0.6 kg CO₂e" },
          { day: "Friday", action: "Cycle to nearby market", saving: "0.4 kg CO₂e" },
        ];
      case "Food & Diet":
        return [
          { day: "Monday", action: "Choose plant-based vegan meal", saving: "2.5 kg CO₂e" },
          { day: "Tuesday", action: "Avoid ordering food delivery", saving: "0.6 kg CO₂e" },
          { day: "Wednesday", action: "Cook fresh home vegetarian meal", saving: "1.5 kg CO₂e" },
          { day: "Thursday", action: "Ditch heavy meat or fast food", saving: "1.8 kg CO₂e" },
          { day: "Friday", action: "Lower cheese & dairy load", saving: "0.8 kg CO₂e" },
        ];
      case "Home Utility":
        return [
          { day: "Monday", action: "Set AC temperature to 25°C", saving: "0.9 kg CO₂e" },
          { day: "Tuesday", action: "Turn AC off 1 hour early", saving: "1.2 kg CO₂e" },
          { day: "Wednesday", action: "Unplug standby electronic loads", saving: "0.3 kg CO₂e" },
          { day: "Thursday", action: "Air dry laundry clothes", saving: "1.5 kg CO₂e" },
          { day: "Friday", action: "Utilize natural daylighting", saving: "0.4 kg CO₂e" },
        ];
      default:
        return [
          { day: "Monday", action: "Carry reusable insulated bottle", saving: "0.3 kg CO₂e" },
          { day: "Tuesday", action: "Sort waste and recycle plastics", saving: "0.8 kg CO₂e" },
          { day: "Wednesday", action: "Ditch plastic grocery bags", saving: "0.2 kg CO₂e" },
          { day: "Thursday", action: "Compost kitchen food scraps", saving: "0.6 kg CO₂e" },
          { day: "Friday", action: "Choose reused or thrift items", saving: "1.5 kg CO₂e" },
        ];
    }
  };

  const weeklyPlan = getDynamicPlan(biggestSource.category);

  // Carbon diagnosis messages
  const getDiagnosis = () => {
    if (biggestSource.category === "Transport") {
      return {
        cause: "Commuting via vehicle",
        why: "Driving or ride-hailing accounts for high fossil fuels. Short trips have high relative costs.",
        fix: "Replace trips under 3 km with walking or cycling.",
        win: "Avoid 1 cab ride today",
        insight: "Your footprint drops 18% on metro days."
      };
    }
    if (biggestSource.category === "Food & Diet") {
      return {
        cause: "Meat-heavy or delivery diet",
        why: "Red meat requires substantial water/land resources. Food delivery packaging adds waste transport footprint.",
        fix: "Swap one meat meal with a plant-based vegan option.",
        win: "Ditch food delivery",
        insight: "Your footprint drops on home-cooked meal days."
      };
    }
    return {
      cause: "High appliance power load",
      why: "AC systems running at low temperatures utilize grid electricity generated from carbon-heavy plants.",
      fix: "Set AC temperature to 25°C and couple it with fans.",
      win: "Use AC 1 hour less today",
      insight: "Setting AC to 25°C saves 30% grid energy."
    };
  };

  const diagnosis = getDiagnosis();

  return (
    <div className="dashboard pb-12">
      
      {/* 1. Hero Card */}
      <div className="profile neo-box relative mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
          <img 
            src="https://cdn-icons-png.flaticon.com/256/8598/8598863.png" 
            alt="hero" 
            className="w-32 md:w-40 shrink-0" 
          />
          
          {hasTodayEntry ? (
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black font-display uppercase leading-none">
                GOOD MORNING
              </h1>
              <h2 className="text-2xl md:text-3xl font-black text-black/80 font-grotesque mt-1 leading-none">
                {comparisonCopy}
              </h2>
              <div className="pt-2 flex flex-wrap gap-4 items-center justify-center sm:justify-start">
                <span className="text-xl md:text-2xl font-extrabold bg-black text-white px-4 py-1.5 rounded-lg border-2 border-black">
                  {todayFootprint} kg CO₂e today
                </span>
                <span className="text-xs font-black uppercase text-black/70 bg-white/40 px-3 py-1 rounded-md border border-black/10">
                  {diffText}
                </span>
                <span className="text-sm font-extrabold bg-[#BFE8D4] text-black px-3 py-1 rounded-md border-2 border-black">
                  Green Score: {todayScore}/100
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black font-display uppercase leading-none">
                START TODAY'S TRACE
              </h1>
              <h2 className="text-xl md:text-2xl font-black text-black/80 font-grotesque leading-tight">
                No activity logged yet for today. Trace your commute or diet to calculate score!
              </h2>
              <div className="pt-2">
                <Link href="/tracker">
                  <button className="neo-btn neo-btn-green font-grotesque px-6 py-2">
                    LOG TODAY'S HABITS
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        <img 
          className="sun float-sun hidden lg:block absolute w-48 right-12 top-6" 
          alt="sun" 
          src="https://cdn-icons-png.flaticon.com/256/8073/8073686.png" 
        />
      </div>

      {/* 2. Three Columns Grid (.data) */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        
        {/* Weekly Carbon Plan (table) */}
        <div className="weekly-carbon-plan neo-box flex-1">
          <div className="subtitle flex items-center gap-3 mb-4 relative pl-12 h-12">
            <img 
              alt="runner" 
              src="https://cdn-icons-png.flaticon.com/256/7140/7140112.png" 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 shrink-0" 
            />
            <h2 className="text-2xl font-black text-black leading-none">Weekly Carbon Plan</h2>
          </div>
          
          <table className="neo-table mt-4 w-full">
            <thead>
              <tr>
                <th className="text-xs uppercase font-extrabold">Day</th>
                <th className="text-xs uppercase font-extrabold">Focus Action</th>
                <th className="text-xs uppercase font-extrabold">Target Saving</th>
              </tr>
            </thead>
            <tbody>
              {weeklyPlan.map((plan, idx) => (
                <tr key={idx}>
                  <td>{plan.day}</td>
                  <td>{plan.action}</td>
                  <td>{plan.saving}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Eco Actions (table) */}
        <div className="eco-actions neo-box flex-1 flex flex-col justify-between">
          <div>
            <div className="subtitle flex items-center gap-3 mb-4 relative pl-12 h-12">
              <img 
                alt="exercises" 
                src="https://cdn-icons-png.flaticon.com/256/7140/7140130.png" 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 shrink-0" 
              />
              <h2 className="text-2xl font-black text-black leading-none">Recent Eco Actions</h2>
            </div>
            
            <table className="neo-table mt-4 w-full">
              <thead>
                <tr>
                  <th className="text-xs uppercase font-extrabold">Action</th>
                  <th className="text-xs uppercase font-extrabold">Impact</th>
                </tr>
              </thead>
              <tbody>
                {actions.filter(a => a.completed).slice(0, 5).map((act) => (
                  <tr key={act.id}>
                    <td>{act.title.substring(0, 22)}...</td>
                    <td className="font-bold text-brand-green">-{act.estimatedCarbonSaved} kg</td>
                  </tr>
                ))}
                {actions.filter(a => a.completed).length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center text-xs text-black/50 py-6 italic font-bold">
                      No actions yet. Complete your first action card today!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <Link href="/profile" className="w-full">
            <button className="neo-btn w-full mt-4 font-grotesque">Show all actions</button>
          </Link>
        </div>

        {/* Carbon Impact (list) */}
        <div className="carbon-impact neo-box flex-1">
          <div className="subtitle flex items-center gap-3 mb-4 relative pl-12 h-12">
            <img 
              alt="calories" 
              src="https://cdn-icons-png.flaticon.com/256/7140/7140091.png" 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 shrink-0" 
            />
            <h2 className="text-2xl font-black text-black leading-none">Carbon Impact</h2>
          </div>
          
          <ul className="space-y-4 mt-6">
            <li className="flex justify-between items-center border-b border-black/10 pb-2">
              <span className="text-sm font-bold text-black/60">Today Saved</span>
              <div className="number font-display text-2xl font-extrabold text-brand-green">
                {hasTodayEntry ? completedActions.filter(a => a.completedAt?.startsWith(todayDateStr)).reduce((sum, a) => sum + a.estimatedCarbonSaved, 0).toFixed(1) : "0.0"} kg
              </div>
            </li>
            <li className="flex justify-between items-center border-b border-black/10 pb-2">
              <span className="text-sm font-bold text-black/60">This Week Saved</span>
              <div className="number font-display text-2xl font-extrabold text-brand-cyan">{weeklySaved} kg</div>
            </li>
            <li className="flex justify-between items-center pb-2">
              <span className="text-sm font-bold text-black uppercase">This Month Saved</span>
              <div className="number font-display text-3xl font-extrabold text-brand-yellow">{monthlySaved} kg</div>
            </li>
          </ul>
          
          <p className="text-[10px] text-black/50 font-bold uppercase text-center mt-6">
            * Equal to avoiding multiple short fuel-based rides.
          </p>
        </div>
      </div>

      {/* 3. Achievements Section (Diagnosis & Challenges) */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        
        {/* Carbon Diagnosis */}
        <div className="carbon-diagnosis neo-box flex-1">
          <div className="subtitle flex items-center gap-3 mb-4 relative pl-12 h-12">
            <img 
              alt="bests" 
              src="https://cdn-icons-png.flaticon.com/256/7140/7140103.png" 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 shrink-0" 
            />
            <h2 className="text-2xl font-black text-black leading-none">Carbon Diagnosis</h2>
          </div>
          
          <ul className="space-y-4 mt-6">
            <li className="flex justify-between items-center p-3 bg-brand-secondary/40 border-2 border-black rounded-lg">
              <span className="text-xs font-bold text-black/60 uppercase">Biggest Source</span>
              <div className="font-extrabold text-brand-red text-sm">
                {hasTodayEntry ? `${biggestSource.category} — ${biggestSource.percent}%` : "No entries logged today"}
              </div>
            </li>
            <li className="flex justify-between items-center p-3 bg-brand-secondary/40 border-2 border-black rounded-lg">
              <span className="text-xs font-bold text-black/60 uppercase">Best Fix</span>
              <div className="font-extrabold text-black text-sm">{diagnosis.fix}</div>
            </li>
            <li className="flex justify-between items-center p-3 bg-brand-secondary/40 border-2 border-black rounded-lg">
              <span className="text-xs font-bold text-black/60 uppercase">Easiest Win</span>
              <div className="font-extrabold text-black text-sm">{diagnosis.win}</div>
            </li>
            <li className="flex justify-between items-center p-3 bg-brand-secondary/40 border-2 border-black rounded-lg">
              <span className="text-xs font-bold text-black/60 uppercase">Smart Insight</span>
              <div className="font-extrabold text-black text-sm">{diagnosis.insight}</div>
            </li>
          </ul>
        </div>

        {/* Green Challenges */}
        <div className="green-challenges neo-box flex-1">
          <div className="subtitle flex items-center gap-3 mb-4 relative pl-12 h-12">
            <img 
              alt="challenges" 
              src="https://cdn-icons-png.flaticon.com/256/7140/7140139.png" 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 shrink-0" 
            />
            <h2 className="text-2xl font-black text-black leading-none">Green Challenges</h2>
          </div>

          <div className="space-y-4 mt-6">
            {challenges.map((c) => (
              <div key={c.id || c.title}>
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>{c.title}</span>
                  <span>{c.progress_percent}%</span>
                </div>
                <div className="neo-progress-container">
                  <div className="neo-progress-bar" style={{ width: `${c.progress_percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Additional Feature Grid (4 neo-boxes) */}
      <h3 className="text-3xl font-black text-black mb-4 uppercase font-grotesque">Workspace Toolset</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Feature 1: What-If Simulator */}
        <div className="simulator-card neo-box flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xl font-black text-black">WHAT-IF SIMULATOR</h4>
            <p className="text-xs text-black/60 leading-relaxed font-bold">
              Compare transit, food, or power choices before making them.
            </p>
            <div className="p-3 bg-brand-secondary/40 border-2 border-black rounded-lg text-xs font-semibold mt-2">
              <span className="text-[10px] text-black/50 block font-bold">BIKE → METRO</span>
              Saves 0.48 kg CO₂e + ₹40
            </div>
          </div>
          <Link href="/simulator">
            <button className="neo-btn neo-btn-cyan w-full mt-4 font-grotesque text-sm">TRY SIMULATION</button>
          </Link>
        </div>

        {/* Feature 2: Trace Coach */}
        <div className="coach-card neo-box flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xl font-black text-black">TRACE COACH</h4>
            <p className="text-xs text-black/60 leading-relaxed font-bold">
              AI carbon coach that gives practical, personalized actions.
            </p>
            <div className="p-3 bg-brand-secondary/40 border-2 border-black rounded-lg text-[10px] text-black/70 italic mt-2">
              "Replace two short rides with walking to save around 0.7 kg."
            </div>
          </div>
          <Link href="/coach">
            <button className="neo-btn neo-btn-green w-full mt-4 font-grotesque text-sm">ASK COACH</button>
          </Link>
        </div>

        {/* Feature 3: Weekly Report */}
        <div className="report-card neo-box flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xl font-black text-black">WEEKLY REPORT</h4>
            <p className="text-xs text-black/60 leading-relaxed font-bold">
              This week you generated 47.2 kg CO₂e, 8% lower than last week.
            </p>
            <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-bold uppercase mt-2">
              <div className="bg-white border border-black p-1 rounded">Best: Sun</div>
              <div className="bg-white border border-black p-1 rounded">Source: Car</div>
              <div className="bg-white border border-black p-1 rounded">Done: 6</div>
            </div>
          </div>
          <Link href="/reports">
            <button className="neo-btn neo-btn-yellow w-full mt-4 font-grotesque text-sm">VIEW REPORT</button>
          </Link>
        </div>

        {/* Feature 4: Green Score */}
        <div className="score-card neo-box flex flex-col justify-between text-center">
          <div className="space-y-2">
            <h4 className="text-xl font-black text-black">GREEN SCORE</h4>
            
            <div className="py-2">
              <div className="inline-block text-4xl font-black bg-brand-green border-3 border-black p-3.5 rounded-2xl shadow-[3px_4px_0px_0px_rgba(0,0,0,1)]">
                {todayScore}
              </div>
            </div>
            
            <p className="text-xs text-black/70 font-semibold uppercase leading-tight pt-1">
              Good progress, but transport can improve.
            </p>
          </div>
          <Link href="/profile">
            <button className="neo-btn w-full mt-4 font-grotesque text-sm">VIEW BADGES</button>
          </Link>
        </div>

      </div>

    </div>
  );
}
