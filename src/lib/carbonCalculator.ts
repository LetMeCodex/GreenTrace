import { TravelEntry, FoodEntry, EnergyEntry, ShoppingEntry, WasteEntry } from "../types";

// Emission Factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  travel: {
    walk: 0,
    cycle: 0,
    metro: 0.04,
    bus: 0.08,
    bike: 0.10,
    car: 0.21,
    cab: 0.25,
  },
  food: {
    vegan: 1.5,
    vegetarian: 2.0,
    "dairy-heavy": 3.5,
    chicken: 4.5,
    "red-meat": 7.5,
    "fast-food": 5.0,
    deliveryMarkup: 0.5, // Packaging and local delivery transit
  },
  energy: {
    acPerHour: 1.2,
    fanPerHour: 0.05,
    lightsPerHour: 0.02,
    deviceCharge: 0.01,
    styleBase: {
      low: 1.0,
      moderate: 3.0,
      high: 6.0,
    },
  },
  shopping: {
    none: 0,
    "small-online": 0.8,
    clothing: 5.0,
    electronics: 25.0,
    reused: -1.5, // Carbon offset by choosing circular/thrift
  },
  waste: {
    base: 0.5,
    reusableBottleOffset: -0.2,
    plasticBottlePenalty: 0.5,
    reusableBagOffset: -0.2,
    foodWastePenalty: 1.0,
    recyclingOffset: -0.8,
  },
};

export function calculateTravelEmission(mode: string, distance: number, trips: number = 1): number {
  const factor = EMISSION_FACTORS.travel[mode as keyof typeof EMISSION_FACTORS.travel] ?? 0.15;
  return Number((distance * factor * trips).toFixed(2));
}

export function calculateFoodEmission(mealType: string, delivery: boolean): number {
  const base = EMISSION_FACTORS.food[mealType as keyof typeof EMISSION_FACTORS.food] ?? 2.0;
  const markup = delivery ? EMISSION_FACTORS.food.deliveryMarkup : 0;
  return Number((base + markup).toFixed(2));
}

export function calculateEnergyEmission(
  acHours: number,
  fanHours: number,
  lightsUsage: number,
  devicesCharged: number,
  usageStyle: string
): number {
  const ac = acHours * EMISSION_FACTORS.energy.acPerHour;
  const fan = fanHours * EMISSION_FACTORS.energy.fanPerHour;
  const lights = lightsUsage * EMISSION_FACTORS.energy.lightsPerHour;
  const devices = devicesCharged * EMISSION_FACTORS.energy.deviceCharge;
  const style = EMISSION_FACTORS.energy.styleBase[usageStyle as keyof typeof EMISSION_FACTORS.energy.styleBase] ?? 3.0;

  return Number((ac + fan + lights + devices + style).toFixed(2));
}

export function calculateShoppingEmission(purchaseType: string): number {
  const base = EMISSION_FACTORS.shopping[purchaseType as keyof typeof EMISSION_FACTORS.shopping] ?? 0;
  return Number(base.toFixed(2));
}

export function calculateWasteEmission(choices: {
  reusableBottle: boolean;
  plasticBottleBought: boolean;
  reusableBagUsed: boolean;
  foodWaste: boolean;
  recyclingDone: boolean;
}): number {
  let footprint = EMISSION_FACTORS.waste.base;
  if (choices.reusableBottle) footprint += EMISSION_FACTORS.waste.reusableBottleOffset;
  if (choices.plasticBottleBought) footprint += EMISSION_FACTORS.waste.plasticBottlePenalty;
  if (choices.reusableBagUsed) footprint += EMISSION_FACTORS.waste.reusableBagOffset;
  if (choices.foodWaste) footprint += EMISSION_FACTORS.waste.foodWastePenalty;
  if (choices.recyclingDone) footprint += EMISSION_FACTORS.waste.recyclingOffset;

  return Number(Math.max(0, footprint).toFixed(2));
}

export function calculateDailyTotal(
  travel: TravelEntry,
  food: FoodEntry,
  energy: EnergyEntry,
  shopping: ShoppingEntry,
  waste: WasteEntry
): number {
  const travelCo2 = calculateTravelEmission(travel.mode, travel.distance, travel.trips);
  const foodCo2 = calculateFoodEmission(food.mealType, food.delivery);
  const energyCo2 = calculateEnergyEmission(
    energy.acHours,
    energy.fanHours,
    energy.lightsUsage,
    energy.devicesCharged,
    energy.usageStyle
  );
  const shoppingCo2 = calculateShoppingEmission(shopping.type);
  const wasteCo2 = calculateWasteEmission(waste);

  return Number((travelCo2 + foodCo2 + energyCo2 + shoppingCo2 + wasteCo2).toFixed(2));
}

export function calculateGreenScore(totalEmissions: number): number {
  // Baseline average footprint is ~10 kg CO2e.
  // 0 kg gives 100 score. 15+ kg gives ~10 score.
  const score = Math.round(100 - totalEmissions * 6.5);
  return Math.min(100, Math.max(1, score));
}

export function generateRecommendations(
  travel: TravelEntry,
  food: FoodEntry,
  energy: EnergyEntry,
  shopping: ShoppingEntry,
  waste: WasteEntry
) {
  const travelCo2 = calculateTravelEmission(travel.mode, travel.distance, travel.trips);
  const foodCo2 = calculateFoodEmission(food.mealType, food.delivery);
  const energyCo2 = calculateEnergyEmission(
    energy.acHours,
    energy.fanHours,
    energy.lightsUsage,
    energy.devicesCharged,
    energy.usageStyle
  );

  const recommendations = [];

  if (travelCo2 > 3.0 && ["car", "cab", "bike"].includes(travel.mode)) {
    recommendations.push({
      id: "rec-travel-1",
      title: travel.distance < 4 ? "Walk/cycle for short travel" : "Use metro or carpool",
      category: "travel",
      difficulty: travel.distance < 4 ? "Easy" : "Medium",
      estimatedCarbonSaved: Number((travelCo2 * 0.5).toFixed(2)),
      estimatedMoneySaved: travel.mode === "cab" ? 250 : 80,
    });
  }

  if (foodCo2 > 3.0) {
    if (food.delivery) {
      recommendations.push({
        id: "rec-food-delivery",
        title: "Ditch food delivery packaging",
        category: "food",
        difficulty: "Easy",
        estimatedCarbonSaved: 0.5,
        estimatedMoneySaved: 120,
      });
    }
    if (food.mealType === "red-meat" || food.mealType === "chicken") {
      recommendations.push({
        id: "rec-food-diet",
        title: "Swap one meat meal for plant-based",
        category: "food",
        difficulty: "Easy",
        estimatedCarbonSaved: food.mealType === "red-meat" ? 4.5 : 2.0,
        estimatedMoneySaved: 150,
      });
    }
  }

  if (energyCo2 > 4.0 && energy.acHours > 2) {
    recommendations.push({
      id: "rec-energy-ac",
      title: "Set AC to 25°C & reduce by 1 hour",
      category: "energy",
      difficulty: "Easy",
      estimatedCarbonSaved: Number((energy.acHours * 0.4).toFixed(2)),
      estimatedMoneySaved: 60,
    });
  }

  if (shopping.type === "small-online" || shopping.type === "clothing" || shopping.type === "electronics") {
    recommendations.push({
      id: "rec-shopping-circular",
      title: "Opt for refurbished or thrift items",
      category: "shopping",
      difficulty: "Medium",
      estimatedCarbonSaved: shopping.type === "electronics" ? 15.0 : 3.0,
      estimatedMoneySaved: shopping.type === "electronics" ? 5000 : 800,
    });
  }

  if (waste.plasticBottleBought) {
    recommendations.push({
      id: "rec-waste-bottle",
      title: "Carry a insulated reusable bottle",
      category: "waste",
      difficulty: "Easy",
      estimatedCarbonSaved: 0.7,
      estimatedMoneySaved: 40,
    });
  }

  if (waste.foodWaste) {
    recommendations.push({
      id: "rec-waste-compost",
      title: "Compost kitchen scraps",
      category: "waste",
      difficulty: "Easy",
      estimatedCarbonSaved: 0.8,
      estimatedMoneySaved: 0,
    });
  }

  // Fallbacks if nothing fits
  if (recommendations.length < 3) {
    recommendations.push({
      id: "rec-fallback-1",
      title: "Unplug electronics when fully charged",
      category: "energy",
      difficulty: "Easy",
      estimatedCarbonSaved: 0.2,
      estimatedMoneySaved: 15,
    });
  }
  if (recommendations.length < 3) {
    recommendations.push({
      id: "rec-fallback-2",
      title: "Combine multiple errands into one trip",
      category: "travel",
      difficulty: "Easy",
      estimatedCarbonSaved: 0.5,
      estimatedMoneySaved: 40,
    });
  }

  return recommendations.slice(0, 3);
}
