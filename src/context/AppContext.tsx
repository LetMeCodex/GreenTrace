"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, DailyEntry, Action, Badge } from "../types";
import { MOCK_HISTORY, MOCK_ACTIONS, MOCK_BADGES } from "../lib/mockData";
import { calculateDailyTotal, calculateGreenScore, generateRecommendations } from "../lib/carbonCalculator";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface AppContextProps {
  user: User | null;
  sessionUser: any | null;
  entries: DailyEntry[];
  actions: Action[];
  badges: Badge[];
  challenges: any[];
  loading: boolean;
  isSupabase: boolean;
  completeOnboarding: (
    name: string,
    city: string,
    householdSize: number,
    mainTransportMode: string,
    averageDistance: number,
    dietType: string,
    energyUsage: string,
    shoppingFrequency: string,
    reusableBottle: boolean
  ) => Promise<void>;
  saveDailyEntry: (
    date: string,
    travel: DailyEntry["travel"],
    food: DailyEntry["food"],
    energy: DailyEntry["energy"],
    shopping: DailyEntry["shopping"],
    waste: DailyEntry["waste"]
  ) => Promise<DailyEntry>;
  toggleAction: (id: string) => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  resetAllData: () => Promise<void>;
  signInUser: (email: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionUser, setSessionUser] = useState<any | null>(null);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isSupabase = isSupabaseConfigured;

  // Initialize data (Supabase or LocalStorage) and listen for auth state changes
  useEffect(() => {
    let authListener: any = null;

    async function initSession() {
      if (isSupabase && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setSessionUser(session.user);
            try {
              await loadSupabaseData(session.user.id);
            } catch (err) {
              console.error("Supabase session initialization data load failed, fallback to local:", err);
              loadLocalData();
            }
          } else {
            setSessionUser(null);
            loadLocalData();
          }
        } catch (e) {
          console.error("Supabase session initialization failed, using local fallback:", e);
          setSessionUser(null);
          loadLocalData();
        } finally {
          setLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setSessionUser(session.user);
            try {
              await loadSupabaseData(session.user.id);
            } catch (err) {
              console.error("Supabase auth state change data load failed:", err);
              loadLocalData();
            }
          } else {
            setSessionUser(null);
            setUser(null);
            loadLocalData();
          }
        });
        authListener = subscription;
      } else {
        setSessionUser(null);
        loadLocalData();
        setLoading(false);
      }
    }

    initSession();

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const loadLocalData = () => {
    try {
      const storedUser = localStorage.getItem("gt_user");
      const storedEntries = localStorage.getItem("gt_entries");
      const storedActions = localStorage.getItem("gt_actions");
      const storedBadges = localStorage.getItem("gt_badges");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setEntries(storedEntries ? JSON.parse(storedEntries) : MOCK_HISTORY);
      setActions(storedActions ? JSON.parse(storedActions) : MOCK_ACTIONS);
      setBadges(storedBadges ? JSON.parse(storedBadges) : MOCK_BADGES);
      
      // Seed local challenges
      setChallenges([
        { id: "c-1", title: "Low Carbon Week", description: "Average below 6 kg CO2e", target_value: 100, current_value: 65, progress_percent: 65 },
        { id: "c-2", title: "No Delivery Challenge", description: "Avoid food delivery orders", target_value: 10, current_value: 8, progress_percent: 80 },
        { id: "c-3", title: "Public Transport Streak", description: "Metro commute trips", target_value: 10, current_value: 4, progress_percent: 45 },
        { id: "c-4", title: "Reusable Bottle Habit", description: "Carry insulated water bottles", target_value: 10, current_value: 9, progress_percent: 90 },
      ]);
    } catch (e) {
      console.error("Local data load failed:", e);
    }
  };

  const loadSupabaseData = async (userId: string) => {
    try {
      // 1. Fetch Profile
      const { data: profile, error: profileError } = await supabase!
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw new Error(`Profile query failed: ${profileError.message}`);
      }

      const { data: { user: authUser } } = await supabase!.auth.getUser();
      const email = authUser?.email || undefined;

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || "Anish",
          city: profile.city || "Bengaluru",
          householdSize: profile.household_size || 1,
          mainTransportMode: profile.main_transport_mode || "metro",
          averageDistance: Number(profile.avg_daily_distance_km || 10),
          dietType: profile.diet_type || "Mixed diet",
          energyUsage: profile.electricity_usage_level || "moderate",
          shoppingFrequency: profile.shopping_frequency || "weekly",
          email,
          createdAt: profile.created_at,
        });

        // 2. Fetch daily entries
        const { data: entriesData } = await supabase!
          .from("daily_entries")
          .select("*")
          .eq("user_id", userId)
          .order("entry_date", { ascending: false });

        if (entriesData && entriesData.length > 0) {
          // Map database structure to DailyEntry React types
          const mappedEntries: DailyEntry[] = entriesData.map((e) => ({
            id: e.id,
            userId: e.user_id,
            date: e.entry_date,
            totalCO2e: Number(e.total_co2e),
            greenScore: e.green_score,
            travel: { mode: profile.main_transport_mode || "metro", distance: Number(profile.avg_daily_distance_km || 10), trips: 2 },
            food: { mealType: profile.diet_type === "Vegan" ? "vegan" : "vegetarian", delivery: false },
            energy: { acHours: 2, fanHours: 6, lightsUsage: 4, devicesCharged: 3, usageStyle: profile.electricity_usage_level || "moderate" },
            shopping: { type: "none" },
            waste: { reusableBottle: true, plasticBottleBought: false, reusableBagUsed: true, foodWaste: false, recyclingDone: true },
          }));
          setEntries(mappedEntries);
        } else {
          setEntries([]);
        }

        // 3. Fetch actions
        const { data: actionsData } = await supabase!
          .from("eco_actions")
          .select("*")
          .eq("user_id", userId);

        if (actionsData && actionsData.length > 0) {
          setActions(actionsData.map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category as any,
            difficulty: a.difficulty as any,
            estimatedCarbonSaved: Number(a.estimated_carbon_saved),
            estimatedMoneySaved: Number(a.estimated_money_saved),
            completed: a.completed,
            completedAt: a.completed_at || undefined,
          })));
        } else {
          // Seed standard actions into Supabase if none exist
          const seeded = MOCK_ACTIONS.map(a => ({
            user_id: userId,
            title: a.title,
            category: a.category,
            difficulty: a.difficulty,
            estimated_carbon_saved: a.estimatedCarbonSaved,
            estimated_money_saved: a.estimatedMoneySaved,
            completed: a.completed,
          }));
          await supabase!.from("eco_actions").insert(seeded);
          setActions(MOCK_ACTIONS);
        }

        // 4. Fetch Challenges
        const { data: challengesData } = await supabase!
          .from("challenges")
          .select("*")
          .eq("user_id", userId);

        if (challengesData && challengesData.length > 0) {
          setChallenges(challengesData.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            target_value: Number(c.target_value),
            current_value: Number(c.current_value),
            progress_percent: c.progress_percent,
          })));
        } else {
          // Seed challenges table
          const challengesList = [
            { user_id: userId, title: "Low Carbon Week", description: "Average below 6 kg CO2e", target_value: 100, current_value: 65, progress_percent: 65 },
            { user_id: userId, title: "No Delivery Challenge", description: "Avoid food delivery orders", target_value: 10, current_value: 8, progress_percent: 80 },
            { user_id: userId, title: "Public Transport Streak", description: "Metro commute trips", target_value: 10, current_value: 4, progress_percent: 45 },
            { user_id: userId, title: "Reusable Bottle Habit", description: "Carry insulated water bottles", target_value: 10, current_value: 9, progress_percent: 90 },
          ];
          await supabase!.from("challenges").insert(challengesList);
          setChallenges(challengesList);
        }
      }
      setBadges(MOCK_BADGES);
    } catch (err) {
      console.error("Supabase data load error:", err);
      throw err;
    }
  };

  const completeOnboarding = async (
    name: string,
    city: string,
    householdSize: number,
    mainTransportMode: string,
    averageDistance: number,
    dietType: string,
    energyUsage: string,
    shoppingFrequency: string,
    reusableBottle: boolean
  ) => {
    if (isSupabase && supabase) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const profilePayload = {
          id: authUser.id,
          full_name: name,
          city,
          household_size: householdSize,
          main_transport_mode: mainTransportMode,
          avg_daily_distance_km: averageDistance,
          diet_type: dietType,
          electricity_usage_level: energyUsage,
          shopping_frequency: shoppingFrequency,
          reusable_habit: reusableBottle ? "Yes" : "No",
          baseline_daily_co2e: 8.0,
        };

        const { error } = await supabase.from("profiles").upsert(profilePayload);
        if (error) {
          console.error("Profile onboarding insert failed:", error);
          throw new Error(`Failed to save onboarding profile: ${error.message}`);
        }
        
        await loadSupabaseData(authUser.id);
        return;
      }
    }

    // Local Storage Fallback
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      city,
      householdSize,
      mainTransportMode,
      averageDistance,
      dietType,
      energyUsage,
      shoppingFrequency,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("gt_user", JSON.stringify(newUser));
    setEntries(MOCK_HISTORY);
  };

  const saveDailyEntry = async (
    date: string,
    travel: DailyEntry["travel"],
    food: DailyEntry["food"],
    energy: DailyEntry["energy"],
    shopping: DailyEntry["shopping"],
    waste: DailyEntry["waste"]
  ): Promise<DailyEntry> => {
    // 1. Send parameters to next server API to get Climatiq / Carbon Interface estimated carbon values
    let totalCO2e = calculateDailyTotal(travel, food, energy, shopping, waste);
    let greenScore = calculateGreenScore(totalCO2e);

    try {
      const res = await fetch("/api/carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "travel",
          activity_type: travel.mode,
          quantity: travel.distance,
          metadata: { trips: travel.trips }
        })
      });
      if (res.ok) {
        const calcRes = await res.json();
        // Recalculate with secure API factors if returned
        totalCO2e = calcRes.co2e;
        greenScore = calculateGreenScore(totalCO2e);
      }
    } catch (e) {
      console.warn("Secure carbon estimation route failed, using local factors:", e);
    }

    const activeUserId = user ? user.id : "anish-123";
    const travelCo2 = Number((travel.distance * (travel.mode === "car" ? 0.21 : travel.mode === "metro" ? 0.04 : 0.1)).toFixed(1));
    const foodCo2 = Number((food.mealType === "vegan" ? 0.6 : food.mealType === "red-meat" ? 6.0 : 1.8).toFixed(1));
    const energyCo2 = Number((energy.acHours * 0.8).toFixed(1));
    
    const newEntry: DailyEntry = {
      id: `entry-${date}-${Date.now()}`,
      userId: activeUserId,
      date,
      travel,
      food,
      energy,
      shopping,
      waste,
      totalCO2e,
      greenScore,
    };

    if (isSupabase && supabase) {
      const entryPayload = {
        user_id: activeUserId,
        entry_date: date,
        total_co2e: totalCO2e,
        travel_co2e: travelCo2,
        food_co2e: foodCo2,
        energy_co2e: energyCo2,
        shopping_co2e: 0.5,
        waste_co2e: 0.2,
        green_score: greenScore,
        biggest_source: travelCo2 > foodCo2 ? "Transport" : "Food",
        diagnosis: `Today's emissions are ${totalCO2e} kg CO2e, mostly caused by ${travelCo2 > foodCo2 ? "travel" : "food"} choices.`
      };

      await supabase.from("daily_entries").upsert(entryPayload, { onConflict: "user_id,entry_date" });
      
      // Log activities details
      await supabase.from("activities").insert([
        { user_id: activeUserId, category: "travel", activity_type: travel.mode, quantity: travel.distance, co2e: travelCo2 },
        { user_id: activeUserId, category: "food", activity_type: food.mealType, quantity: 1, co2e: foodCo2 }
      ]);
    }

    // Local update
    const updatedEntries = entries.filter((e) => e.date !== date);
    const resultEntries = [newEntry, ...updatedEntries].sort((a, b) => b.date.localeCompare(a.date));
    setEntries(resultEntries);
    localStorage.setItem("gt_entries", JSON.stringify(resultEntries));

    return newEntry;
  };

  const toggleAction = async (id: string) => {
    const updated = actions.map((act) => {
      if (act.id === id) {
        const completed = !act.completed;
        return {
          ...act,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      }
      return act;
    });
    setActions(updated);

    if (isSupabase && supabase) {
      const activeAction = actions.find(a => a.id === id);
      if (activeAction) {
        await supabase
          .from("eco_actions")
          .update({
            completed: !activeAction.completed,
            completed_at: !activeAction.completed ? new Date().toISOString() : null,
          })
          .eq("id", id);
      }
    } else {
      localStorage.setItem("gt_actions", JSON.stringify(updated));
    }
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);

    if (isSupabase && supabase) {
      await supabase
        .from("profiles")
        .update({
          full_name: profile.name,
          city: profile.city,
          household_size: profile.householdSize,
          main_transport_mode: profile.mainTransportMode,
          diet_type: profile.dietType,
          green_score_goal: (profile as any).greenScoreGoal,
          weekly_reduction_goal: (profile as any).weeklyReductionGoal,
        })
        .eq("id", user.id);
    } else {
      localStorage.setItem("gt_user", JSON.stringify(updatedUser));
    }
  };

  const signInUser = async (email: string): Promise<boolean> => {
    if (isSupabase && supabase) {
      try {
        // Send a magic link or OTP to simplify Sign In / Sign Up
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
          console.error("Sign In failed:", error);
          return false;
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    return false;
  };

  const signOutUser = async () => {
    if (isSupabase && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setEntries(MOCK_HISTORY);
  };

  const resetAllData = async () => {
    if (isSupabase && supabase && user) {
      await supabase.from("daily_entries").delete().eq("user_id", user.id);
      await supabase.from("activities").delete().eq("user_id", user.id);
      await supabase.from("eco_actions").delete().eq("user_id", user.id);
    }
    localStorage.clear();
    setUser(null);
    setEntries(MOCK_HISTORY);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        sessionUser,
        entries,
        actions,
        badges,
        challenges,
        loading,
        isSupabase,
        completeOnboarding,
        saveDailyEntry,
        toggleAction,
        updateUserProfile,
        resetAllData,
        signInUser,
        signOutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
