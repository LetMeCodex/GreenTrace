export interface User {
  id: string;
  name: string;
  city: string;
  householdSize: number;
  mainTransportMode: string;
  averageDistance: number;
  dietType: string;
  energyUsage: string; // "low" | "moderate" | "high"
  shoppingFrequency: string; // "rarely" | "monthly" | "weekly" | "often"
  email?: string;
  createdAt: string;
}

export interface TravelEntry {
  mode: string;
  distance: number;
  trips: number;
}

export interface FoodEntry {
  mealType: string; // "vegan" | "vegetarian" | "dairy-heavy" | "chicken" | "red-meat" | "fast-food"
  delivery: boolean;
}

export interface EnergyEntry {
  acHours: number;
  fanHours: number;
  lightsUsage: number; // hours
  devicesCharged: number; // number of devices
  usageStyle: string; // "low" | "moderate" | "high"
}

export interface ShoppingEntry {
  type: string; // "none" | "small-online" | "clothing" | "electronics" | "reused"
}

export interface WasteEntry {
  reusableBottle: boolean;
  plasticBottleBought: boolean;
  reusableBagUsed: boolean;
  foodWaste: boolean;
  recyclingDone: boolean;
}

export interface DailyEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  travel: TravelEntry;
  food: FoodEntry;
  energy: EnergyEntry;
  shopping: ShoppingEntry;
  waste: WasteEntry;
  totalCO2e: number;
  greenScore: number;
}

export interface Action {
  id: string;
  title: string;
  category: "travel" | "food" | "energy" | "shopping" | "waste";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedCarbonSaved: number; // in kg CO2e
  estimatedMoneySaved: number; // in INR (₹)
  completed: boolean;
  completedAt?: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: "travel" | "food" | "energy" | "shopping" | "waste" | "general";
  impact: number; // estimated saving in kg
  recommendation: string;
  confidence: "High" | "Medium" | "Low";
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
