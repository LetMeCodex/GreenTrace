"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Terminal,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { 
  calculateTravelEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission, 
  calculateShoppingEmission, 
  calculateWasteEmission 
} from "../../lib/carbonCalculator";

interface Message {
  id: string;
  sender: "coach" | "user";
  text: string;
  timestamp: Date;
}

export default function CarbonCoach() {
  const { user, entries } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "coach",
      text: `Hello ${user ? user.name : "Anish"}! I am Trace, your AI Carbon Coach. I analyze your daily habits across travel, energy, diet, and circular waste to give you practical, guilt-free steps to lower your impact. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const quickPrompts = [
    { label: "Analyze my week", value: "Analyze my week" },
    { label: "Reduce my footprint today", value: "Give me actions to reduce my footprint today" },
    { label: "Explain my Green Score", value: "Explain my Green Score and why it changes" },
    { label: "Plan a low-carbon commute", value: "How can I commute with less emissions?" },
  ];

  // Logic to generate smart mock responses based on active user context
  const getCoachResponse = (query: string): string => {
    const text = query.toLowerCase();

    // 1. Analyze Week
    if (text.includes("week") || text.includes("analyze")) {
      let travel = 0, food = 0, energy = 0, shopping = 0, waste = 0;
      entries.forEach((e) => {
        travel += calculateTravelEmission(e.travel.mode, e.travel.distance, e.travel.trips);
        food += calculateFoodEmission(e.food.mealType, e.food.delivery);
        energy += calculateEnergyEmission(e.energy.acHours, e.energy.fanHours, e.energy.lightsUsage, e.energy.devicesCharged, e.energy.usageStyle);
        shopping += calculateShoppingEmission(e.shopping.type);
        waste += calculateWasteEmission(e.waste);
      });
      const total = travel + food + energy + shopping + waste;
      const travelPct = total > 0 ? Math.round((travel / total) * 100) : 0;
      const foodPct = total > 0 ? Math.round((food / total) * 100) : 0;

      return `Looking at your carbon logs for this week, you generated approximately ${total.toFixed(1)} kg CO₂e. 
      Your biggest footprint source is Travel (${travelPct}%) followed by Food (${foodPct}%). 
      To make the biggest drop next week, replace two short commutes with walking or public transit. That alone can save around 2.5 kg CO₂e.`;
    }

    // 2. Reduce Footprint Today
    if (text.includes("reduce") || text.includes("today") || text.includes("actions")) {
      return `Here are 3 quick actions you can take today:
      1. Carry a reusable insulated water bottle. Doing this avoids plastic bottle purchases and offsets 0.5 kg CO₂e.
      2. Set your AC to 25°C instead of 20°C and turn it off 1 hour early. This saves ~1.2 kg CO₂e and ₹60.
      3. Cook a home-cooked vegetarian or vegan meal instead of ordering delivery, saving 1.5 kg CO₂e in packaging and transit.`;
    }

    // 3. Explain Green Score
    if (text.includes("score") || text.includes("green score")) {
      const avgScore = entries.length > 0
        ? Math.round(entries.reduce((sum, e) => sum + e.greenScore, 0) / entries.length)
        : 72;
      return `Your Green Score (currently averaging ${avgScore}/100) measures your carbon efficiency. 
      A score of 100 means zero emission habits (fully walking, vegan meals, no AC, offsets). 
      When you log high-impact choices like single-occupancy car travel or mutton dishes, the score decreases. 
      You can boost it by logging circular actions like recycling or choosing thrift items!`;
    }

    // 4. Low-carbon commute
    if (text.includes("commute") || text.includes("travel") || text.includes("transport")) {
      const transportMode = user?.mainTransportMode || "car";
      return `Your main transport mode is currently logged as ${transportMode}. 
      If you switch a 10 km ride from ${transportMode} to the Metro, you will reduce travel emissions by over 80%, saving ~1.8 kg CO₂e. 
      For distances under 2 km, walk or cycle—it has a 0 kg emission footprint and counts as daily cardio!`;
    }

    // Default fallback
    return `That's a great question about climate footprint! To reduce impact in that area:
    - Opt for circular or reused products instead of new ones (which has heavy supply-chain carbon).
    - Unplug electronics when fully charged to eliminate phantom energy loads.
    - Focus on small, repeatable daily habits rather than massive overnight changes.
    Small switches yield visible impact!`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setTyping(true);

    try {
      let travel = 0, food = 0, energy = 0, shopping = 0, waste = 0;
      entries.forEach((e) => {
        travel += calculateTravelEmission(e.travel.mode, e.travel.distance, e.travel.trips);
        food += calculateFoodEmission(e.food.mealType, e.food.delivery);
        energy += calculateEnergyEmission(e.energy.acHours, e.energy.fanHours, e.energy.lightsUsage, e.energy.devicesCharged, e.energy.usageStyle);
        shopping += calculateShoppingEmission(e.shopping.type);
        waste += calculateWasteEmission(e.waste);
      });
      const total = travel + food + energy + shopping + waste;
      const biggestCategory = travel > food ? "Transport" : "Food";

      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          userProfile: user ? {
            full_name: user.name,
            city: user.city,
            main_transport_mode: user.mainTransportMode,
            avg_daily_distance_km: user.averageDistance,
            diet_type: user.dietType,
          } : null,
          last7Days: entries.slice(0, 7).map(e => ({
            total_co2e: e.totalCO2e,
            entry_date: e.date,
          })),
          biggestSource: biggestCategory,
          completedActionsCount: 0
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const coachMsg: Message = {
          id: `msg-coach-${Date.now()}`,
          sender: "coach",
          text: data.text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, coachMsg]);
      } else {
        throw new Error("Coach API response was not OK");
      }
    } catch (err) {
      console.warn("Secure coach server route failed, using local fallback response:", err);
      const replyText = getCoachResponse(textToSend);
      const coachMsg: Message = {
        id: `msg-coach-${Date.now()}`,
        sender: "coach",
        text: replyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">AI Carbon Coach</h2>
        <p className="text-xs text-brand-muted mt-1">Chat with Trace, your personalized advisor, for data-backed climate reduction tips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-190px)] items-stretch">
        
        {/* Chat Interface */}
        <div className="lg:col-span-8 glass-card rounded-2xl border border-brand-border flex flex-col h-full overflow-hidden">
          
          {/* Coach Header */}
          <div className="p-4 border-b border-brand-border bg-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-green glow-green" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-text">Trace Coach</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <span className="text-[10px] text-brand-muted">Ready to analyze logs</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
            <AnimatePresence>
              {messages.map((msg) => {
                const isCoach = msg.sender === "coach";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 max-w-[85%] ${isCoach ? "" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isCoach 
                        ? "bg-brand-green/10 border-brand-green/20 text-brand-green" 
                        : "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan"
                    }`}>
                      {isCoach ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isCoach 
                        ? "bg-white/5 border border-brand-border text-brand-text rounded-tl-sm whitespace-pre-line" 
                        : "bg-brand-cyan/10 border border-brand-cyan/20 text-brand-text rounded-tr-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
              
              {typing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-brand-border flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Form Action */}
          <div className="p-4 border-t border-brand-border bg-brand-secondary/40 space-y-3">
            
            {/* Quick prompts */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.value)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border bg-brand-bg/50 hover:bg-white/5 text-[10px] font-semibold text-brand-muted hover:text-brand-text transition shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Trace anything... e.g. How do online orders impact emissions?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                className="p-3 bg-brand-green hover:bg-brand-green/90 text-brand-bg rounded-xl flex items-center justify-center transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Coach Knowledge Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-4 h-full">
            <div>
              <h3 className="text-xs uppercase font-bold text-brand-muted tracking-wider">Coach Knowledge Base</h3>
              <p className="text-[10px] text-brand-muted mt-0.5 font-medium">Core formulas programmed into Trace</p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-brand-text block">1. Commutes</span>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  Driving (0.21 kg/km) generates 5x more emissions than electric metros (0.04 kg/km). Short trips under 3 km have high starting idle loads.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-brand-text block">2. Plant Swap</span>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  Switching from red meat (7.5 kg/meal) to a vegan meal (1.5 kg/meal) reduces carbon output by 80%.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-brand-text block">3. Grid Efficiency</span>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  Keeping air conditioners at 25°C reduces electricity load by 30-40% compared to cooling at 19°C.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
