"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Users, 
  Sparkles, 
  Award, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  TrainFront, 
  ChefHat, 
  Footprints,
  Plus,
  Mail,
  Navigation,
  UtensilsCrossed,
  Target,
  TrendingDown
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Profile() {
  const { user, entries, actions, badges, updateUserProfile, resetAllData, signOutUser } = useApp();

  // Settings form states
  const [name, setName] = useState(user?.name || "Anish");
  const [city, setCity] = useState(user?.city || "Bengaluru");
  const [householdSize, setHouseholdSize] = useState(user?.householdSize || 1);
  const [mainTransportMode, setMainTransportMode] = useState(user?.mainTransportMode || "metro");
  const [dietType, setDietType] = useState(user?.dietType || "Mixed diet");
  const [greenScoreGoal, setGreenScoreGoal] = useState((user as any)?.greenScoreGoal || 75);
  const [weeklyReductionGoal, setWeeklyReductionGoal] = useState((user as any)?.weeklyReductionGoal || 10);
  const [saveMessage, setSaveMessage] = useState("");

  // Sync form states with user data when it finishes loading asynchronously
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCity(user.city || "");
      setHouseholdSize(user.householdSize || 1);
      setMainTransportMode(user.mainTransportMode || "metro");
      setDietType(user.dietType || "Mixed diet");
      setGreenScoreGoal((user as any).greenScoreGoal || 75);
      setWeeklyReductionGoal((user as any).weeklyReductionGoal || 10);
    }
  }, [user]);

  // Goals list
  const [goals, setGoals] = useState([
    { id: "g1", title: "Reduce weekly footprint by 10%", completed: true },
    { id: "g2", title: "Complete 5 actions/week", completed: false },
    { id: "g3", title: "Keep Green Score above 75", completed: false },
    { id: "g4", title: "Try 2 low-carbon commute days", completed: true },
  ]);

  const [newGoalText, setNewGoalText] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ 
      name, 
      city, 
      householdSize,
      mainTransportMode,
      dietType,
      greenScoreGoal,
      weeklyReductionGoal
    } as any);
    setSaveMessage("Profile saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals((prev) => [
      ...prev,
      { id: `g-${Date.now()}`, title: newGoalText, completed: false },
    ]);
    setNewGoalText("");
  };

  const handleSignOut = async () => {
    await signOutUser();
    window.location.href = "/";
  };

  // Stats Calculations
  const streak = entries && entries.length > 0 ? entries.length : 5;
  const completedActions = actions.filter((a) => a.completed);
  const carbonSavedActions = Number(completedActions.reduce((sum, a) => sum + a.estimatedCarbonSaved, 0).toFixed(1));
  const totalSaved = Number((carbonSavedActions + 18.6).toFixed(1));

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const size = "w-6 h-6";
    const color = unlocked ? "text-brand-green" : "text-brand-muted opacity-50";

    switch (iconName) {
      case "Footprint":
        return <Footprints className={`${size} ${color}`} />;
      case "TrainFront":
        return <TrainFront className={`${size} ${color}`} />;
      case "Sparkles":
        return <Sparkles className={`${size} ${color}`} />;
      case "ChefHat":
        return <ChefHat className={`${size} ${color}`} />;
      case "ShieldCheck":
        return <ShieldCheck className={`${size} ${color}`} />;
      default:
        return <Award className={`${size} ${color}`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-text">Profile & Goals</h2>
          <p className="text-xs text-brand-muted mt-1">Configure your lifestyle variables, track weekly habits goals, and manage your badges cabinet.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="font-bold text-xs bg-[#FF8FB8] hover:bg-[#FF8FB8]/90 text-[#06130B] py-2.5 px-5 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(6,19,11,1)] transition hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(6,19,11,1)] cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl border border-brand-border p-4 flex items-center gap-4 shadow-md bg-white/5">
          <div className="p-3 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl">
            <Flame className="w-6 h-6 text-[#F2D048] fill-[#F2D048]/10" />
          </div>
          <div>
            <p className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Current Streak</p>
            <h4 className="text-xl font-bold text-brand-text">{streak} Days Active</h4>
          </div>
        </div>
        <div className="glass-card rounded-2xl border border-brand-border p-4 flex items-center gap-4 shadow-md bg-white/5">
          <div className="p-3 bg-brand-green/10 border border-brand-green/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-brand-green" />
          </div>
          <div>
            <p className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Total Carbon Saved</p>
            <h4 className="text-xl font-bold text-brand-text">{totalSaved} kg CO₂e</h4>
          </div>
        </div>
        <div className="glass-card rounded-2xl border border-brand-border p-4 flex items-center gap-4 shadow-md bg-white/5">
          <div className="p-3 bg-brand-mint/10 border border-brand-mint/20 rounded-xl">
            <Award className="w-6 h-6 text-brand-green" />
          </div>
          <div>
            <p className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Badges Unlocked</p>
            <h4 className="text-xl font-bold text-brand-text">{badges.filter(b => b.unlocked).length} / {badges.length}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Settings & Goals */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Edit profile settings */}
          <div className="glass-card rounded-2xl border border-brand-border p-5 md:p-6 space-y-4 bg-white/5">
            <h3 className="text-sm font-bold text-brand-text">Lifestyle Profile</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email (Read-Only) */}
                <div className="sm:col-span-2">
                  <label htmlFor="profile-email-input" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <input 
                      id="profile-email-input"
                      type="text" 
                      readOnly
                      value={user?.email || "No email linked"} 
                      className="w-full bg-brand-secondary/40 border border-brand-border rounded-xl py-2 px-9 text-xs text-brand-muted focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="profile-name-input" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <input 
                      id="profile-name-input"
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl py-2 px-9 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="profile-city-input" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <input 
                      id="profile-city-input"
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl py-2 px-9 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    />
                  </div>
                </div>

                {/* Transport Mode */}
                <div>
                  <label htmlFor="profile-transport-select" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">Main Transport Mode</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <select
                      id="profile-transport-select"
                      value={mainTransportMode}
                      onChange={(e) => setMainTransportMode(e.target.value)}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl py-2 pl-9 pr-3 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    >
                      <option value="walk">Walk</option>
                      <option value="cycle">Cycle</option>
                      <option value="metro">Metro</option>
                      <option value="bus">Bus</option>
                      <option value="bike">Bike</option>
                      <option value="car">Car</option>
                      <option value="cab">Cab</option>
                    </select>
                  </div>
                </div>

                {/* Diet Type */}
                <div>
                  <label htmlFor="profile-diet-select" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">Diet Type</label>
                  <div className="relative">
                    <UtensilsCrossed className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <select
                      id="profile-diet-select"
                      value={dietType}
                      onChange={(e) => setDietType(e.target.value)}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl py-2 pl-9 pr-3 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    >
                      <option value="Vegan">Vegan</option>
                      <option value="Mostly vegetarian">Mostly vegetarian</option>
                      <option value="Dairy-heavy">Dairy-heavy</option>
                      <option value="Mixed diet">Mixed diet</option>
                      <option value="Non-vegetarian">Non-vegetarian</option>
                    </select>
                  </div>
                </div>

                {/* Green Score Goal */}
                <div>
                  <label htmlFor="profile-score-goal-input" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">Green Score Goal (1-100)</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <input 
                      id="profile-score-goal-input"
                      type="number"
                      min="1"
                      max="100"
                      value={greenScoreGoal}
                      onChange={(e) => setGreenScoreGoal(Number(e.target.value))}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl py-2 px-9 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    />
                  </div>
                </div>

                {/* Weekly Reduction Goal */}
                <div>
                  <label htmlFor="profile-reduction-goal-input" className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1.5">Weekly Reduction Goal (%)</label>
                  <div className="relative">
                    <TrendingDown className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                    <input 
                      id="profile-reduction-goal-input"
                      type="number"
                      min="1"
                      max="100"
                      value={weeklyReductionGoal}
                      onChange={(e) => setWeeklyReductionGoal(Number(e.target.value))}
                      className="w-full bg-brand-secondary/80 border border-brand-border rounded-xl py-2 px-9 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
                    />
                  </div>
                </div>

              </div>

              {/* Household Size */}
              <div>
                <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-2">Household Size</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setHouseholdSize(num)}
                      className={`py-2 border rounded-xl text-xs font-semibold transition ${
                        householdSize === num 
                          ? "bg-brand-green/10 border-brand-green text-brand-green" 
                          : "bg-brand-secondary/80 border-brand-border text-brand-muted hover:bg-white/5"
                      }`}
                    >
                      {num === 5 ? "5+" : num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-brand-border/60 flex justify-between items-center">
                {saveMessage && <span className="text-[11px] text-brand-green font-semibold">{saveMessage}</span>}
                <button
                  type="submit"
                  className="ml-auto font-bold text-xs bg-brand-green text-brand-bg py-2 px-5 rounded-xl hover:shadow-lg hover:shadow-brand-green/15 transition duration-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Save settings
                </button>
              </div>
            </form>
          </div>

          {/* Active Goals Checklist */}
          <div className="glass-card rounded-2xl border border-brand-border p-5 md:p-6 space-y-4 bg-white/5">
            <h3 className="text-sm font-bold text-brand-text">Carbon Goals Checklist</h3>
            
            <div className="space-y-2">
              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  onClick={() => handleToggleGoal(goal.id)}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-brand-border rounded-xl cursor-pointer hover:bg-white/10 transition"
                >
                  <button className={`shrink-0 transition ${goal.completed ? "text-brand-green" : "text-brand-muted"}`}>
                    <CheckCircle2 className={`w-4 h-4 ${goal.completed ? "fill-brand-green/10" : ""}`} />
                  </button>
                  <span className={`text-xs ${goal.completed ? "text-brand-muted line-through" : "text-brand-text font-medium"}`}>
                    {goal.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom carbon goal..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-green/45"
              />
              <button
                type="submit"
                className="p-2 bg-white/5 border border-brand-border hover:bg-white/10 text-brand-text rounded-xl shrink-0 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Reset Action */}
          <div className="glass-card rounded-2xl border border-brand-border p-4 flex items-center justify-between bg-brand-red/5">
            <div>
              <h4 className="text-xs font-bold text-brand-text">Clear Cache & Reset</h4>
              <p className="text-[10px] text-brand-muted mt-0.5">Deletes all saved daily carbon entries and starts onboarding again.</p>
            </div>
            <button
              onClick={() => {
                if (confirm("Reset all tracked entries and start over?")) {
                  resetAllData();
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-red border border-brand-red/25 hover:bg-brand-red/10 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Data
            </button>
          </div>

        </div>

        {/* Right Side: Badges Cabinet */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl border border-brand-border p-5 space-y-4 bg-white/5">
            <div>
              <h3 className="text-sm font-bold text-brand-text">Badges Cabinet</h3>
              <p className="text-[10px] text-brand-muted mt-0.5 font-medium">Unlocked achievements and credentials</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`glass-card rounded-xl p-3.5 border text-center flex flex-col items-center justify-center space-y-2 relative overflow-hidden transition-all duration-300 ${
                    badge.unlocked 
                      ? "border-brand-green/20 bg-brand-green/[0.01] shadow-md shadow-brand-green/5" 
                      : "border-brand-border opacity-50 grayscale"
                  }`}
                >
                  {/* Lock glow accent */}
                  {badge.unlocked && (
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-brand-green" />
                  )}

                  <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                    badge.unlocked ? "bg-brand-green/10 border-brand-green/20" : "bg-white/5 border-white/5"
                  }`}>
                    {getBadgeIcon(badge.icon, badge.unlocked)}
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-brand-text">{badge.title}</h4>
                    <p className="text-[9px] text-brand-muted mt-0.5 leading-snug">{badge.description}</p>
                  </div>

                  {badge.unlocked && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded mt-1">
                      Unlocked
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
