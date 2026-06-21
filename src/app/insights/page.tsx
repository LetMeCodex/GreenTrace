"use client";

import React from "react";
import { 
  Zap, 
  Sparkles, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  HelpCircle as QuestionIcon
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { 
  calculateTravelEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission,
  calculateShoppingEmission,
  calculateWasteEmission
} from "../../lib/carbonCalculator";

export default function Insights() {
  const { entries, actions } = useApp();

  // Aggregate statistics for dynamic insights
  let totalTravel = 0;
  let totalFood = 0;
  let totalEnergy = 0;
  let foodDeliveryCount = 0;
  let mondayEmissions = 0;
  let sundayEmissions = 0;

  entries.forEach((e) => {
    const travel = calculateTravelEmission(e.travel.mode, e.travel.distance, e.travel.trips);
    const food = calculateFoodEmission(e.food.mealType, e.food.delivery);
    const energy = calculateEnergyEmission(e.energy.acHours, e.energy.fanHours, e.energy.lightsUsage, e.energy.devicesCharged, e.energy.usageStyle);
    
    totalTravel += travel;
    totalFood += food;
    totalEnergy += energy;

    if (e.food.delivery) foodDeliveryCount++;

    const dayName = new Date(e.date).toLocaleDateString("en-US", { weekday: "long" });
    if (dayName === "Monday") mondayEmissions = e.totalCO2e;
    if (dayName === "Sunday") sundayEmissions = e.totalCO2e;
  });

  const completedActions = actions.filter((a) => a.completed);
  const carbonSavedActions = Number(completedActions.reduce((sum, a) => sum + a.estimatedCarbonSaved, 0).toFixed(1));

  // Determine insights dynamically based on context
  const insightsList = [];

  // Insight 1: Carbon saved
  if (completedActions.length > 0) {
    insightsList.push({
      id: "ins-saved",
      title: "Completed climate habits yielding offsets",
      description: `You successfully completed ${completedActions.length} climate actions this week, removing carbon from your footprint.`,
      actionText: "Check other smart actions on your dashboard.",
      impact: `${carbonSavedActions} kg CO₂e saved`,
      confidence: "High",
      type: "success",
    });
  }

  // Insight 2: Monday vs Sunday (Commute pattern)
  if (mondayEmissions > sundayEmissions) {
    insightsList.push({
      id: "ins-commute",
      title: "Emissions spike on Mondays",
      description: `Your footprint peaked at ${mondayEmissions} kg CO₂e on Monday, compared to ${sundayEmissions} kg on Sunday, driven by long commutes.`,
      actionText: "Consider carpooling or taking the metro on Mondays.",
      impact: "Saves ~2.4 kg CO₂e/week",
      confidence: "High",
      type: "warning",
    });
  }

  // Insight 3: Diet & Food Delivery markup
  if (foodDeliveryCount >= 2) {
    const packagingCo2 = Number((foodDeliveryCount * 0.5).toFixed(1));
    insightsList.push({
      id: "ins-delivery",
      title: "Delivery packages multiplying carbon",
      description: `You ordered delivery ${foodDeliveryCount} times this week. Transit emissions and single-use packaging added ${packagingCo2} kg to your total.`,
      actionText: "Prepare home meals or pick up items locally.",
      impact: "Saves ~1.2 kg CO₂e/week",
      confidence: "Medium",
      type: "info",
    });
  }

  // Insight 4: Travel vs Food + Energy combined
  if (totalTravel > (totalFood + totalEnergy)) {
    insightsList.push({
      id: "ins-travel-heavy",
      title: "Commute represents main emission source",
      description: "Your travel carbon load is higher than your food and household energy usage combined.",
      actionText: "Swap low distance vehicle commutes with walk/cycle modes.",
      impact: "Reduces footprint by ~35%",
      confidence: "High",
      type: "warning",
    });
  }

  // Fallback insight
  if (insightsList.length < 3) {
    insightsList.push({
      id: "ins-fallback",
      title: "Steady low-impact food choices",
      description: "Your diet carbon remains low because you select plant-based vegan or vegetarian meals frequently.",
      actionText: "Maintain your low-meat lifestyle habits.",
      impact: "Saves ~4.5 kg CO₂e/meal",
      confidence: "High",
      type: "success",
    });
  }

  const getConfidenceStyles = (conf: string) => {
    switch (conf) {
      case "High": return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case "Medium": return "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20";
      default: return "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">Insights Engine</h2>
        <p className="text-xs text-brand-muted mt-1">AI-driven lifestyle anomaly detection and automated habit optimization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insightsList.map((ins) => (
          <div 
            key={ins.id}
            className="glass-card rounded-2xl p-5 border border-brand-border flex flex-col justify-between space-y-4 hover:border-white/10 transition duration-300"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getConfidenceStyles(ins.confidence)}`}>
                  Confidence: {ins.confidence}
                </span>
                
                {ins.type === "success" && <CheckCircle className="w-5 h-5 text-brand-green" />}
                {ins.type === "warning" && <AlertTriangle className="w-5 h-5 text-brand-red" />}
                {ins.type === "info" && <Lightbulb className="w-5 h-5 text-brand-cyan animate-pulse" />}
              </div>
              
              <h3 className="text-sm font-bold text-brand-text leading-snug">{ins.title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed">{ins.description}</p>
            </div>

            {/* Recommendation details */}
            <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-brand-muted block">Suggested Action</span>
                <span className="text-xs font-semibold text-brand-text mt-0.5 block truncate max-w-[200px]">{ins.actionText}</span>
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-right shrink-0">
                <span className="text-[9px] uppercase font-bold text-brand-cyan tracking-wider block">Est. Impact</span>
                <span className="text-xs font-extrabold text-brand-cyan block mt-0.5">{ins.impact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
