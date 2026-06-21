import { describe, it, expect } from "vitest";
import { 
  calculateTravelEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission, 
  calculateShoppingEmission, 
  calculateWasteEmission, 
  calculateDailyTotal, 
  calculateGreenScore,
  generateRecommendations
} from "./carbonCalculator";
import { TravelEntry, FoodEntry, EnergyEntry, ShoppingEntry, WasteEntry } from "../types";

describe("Carbon Footprint Calculator Unit Tests", () => {
  describe("calculateTravelEmission", () => {
    it("returns correct calculation for walk/cycle (should be 0)", () => {
      expect(calculateTravelEmission("walk", 15)).toBe(0);
      expect(calculateTravelEmission("cycle", 8)).toBe(0);
    });

    it("calculates emissions correctly for motorized transport modes", () => {
      // car factor = 0.21. 10km * 0.21 * 2 trips = 4.2
      expect(calculateTravelEmission("car", 10, 2)).toBe(4.2);
      // metro factor = 0.04. 15km * 0.04 * 1 trip = 0.6
      expect(calculateTravelEmission("metro", 15, 1)).toBe(0.6);
      // fallback factor = 0.15
      expect(calculateTravelEmission("unknown-mode", 10, 1)).toBe(1.5);
    });
  });

  describe("calculateFoodEmission", () => {
    it("returns base emissions for different diet meal types", () => {
      expect(calculateFoodEmission("vegan", false)).toBe(1.5);
      expect(calculateFoodEmission("vegetarian", false)).toBe(2.0);
      expect(calculateFoodEmission("red-meat", false)).toBe(7.5);
    });

    it("adds delivery markup if requested", () => {
      // vegan = 1.5 + markup = 0.5 = 2.0
      expect(calculateFoodEmission("vegan", true)).toBe(2.0);
      // fallback diet = 2.0 + markup = 0.5 = 2.5
      expect(calculateFoodEmission("unknown-diet", true)).toBe(2.5);
    });
  });

  describe("calculateEnergyEmission", () => {
    it("sums ac, fan, lights, devices charging, and baseline lifestyle style style", () => {
      // ac = 2 * 1.2 = 2.4
      // fan = 8 * 0.05 = 0.4
      // lights = 5 * 0.02 = 0.1
      // devices = 3 * 0.01 = 0.03
      // styleBase moderate = 3.0
      // total = 2.4 + 0.4 + 0.1 + 0.03 + 3.0 = 5.93
      expect(calculateEnergyEmission(2, 8, 5, 3, "moderate")).toBe(5.93);
    });

    it("handles low and high usage styles with fallback", () => {
      // low style = 1.0, total with 0 hours = 1.0
      expect(calculateEnergyEmission(0, 0, 0, 0, "low")).toBe(1.0);
      // high style = 6.0, total with 0 hours = 6.0
      expect(calculateEnergyEmission(0, 0, 0, 0, "high")).toBe(6.0);
      // fallback style = 3.0
      expect(calculateEnergyEmission(0, 0, 0, 0, "unknown-style")).toBe(3.0);
    });
  });

  describe("calculateShoppingEmission", () => {
    it("returns correct carbon load or offset", () => {
      expect(calculateShoppingEmission("none")).toBe(0);
      expect(calculateShoppingEmission("electronics")).toBe(25.0);
      expect(calculateShoppingEmission("reused")).toBe(-1.5);
      expect(calculateShoppingEmission("unknown")).toBe(0);
    });
  });

  describe("calculateWasteEmission", () => {
    it("returns baseline waste value modified by habits", () => {
      // base = 0.5
      // all offsets active: bottle (-0.2), bag (-0.2), recycling (-0.8) = -1.2
      // base 0.5 - 1.2 = -0.7. Should be capped at 0.
      expect(calculateWasteEmission({
        reusableBottle: true,
        plasticBottleBought: false,
        reusableBagUsed: true,
        foodWaste: false,
        recyclingDone: true
      })).toBe(0);

      // base = 0.5
      // penalties active: plastic bottle (+0.5), food waste (+1.0) = +1.5
      // base 0.5 + 1.5 = 2.0
      expect(calculateWasteEmission({
        reusableBottle: false,
        plasticBottleBought: true,
        reusableBagUsed: false,
        foodWaste: true,
        recyclingDone: false
      })).toBe(2.0);
    });
  });

  describe("calculateDailyTotal", () => {
    it("aggregates categories correctly", () => {
      const travel: TravelEntry = { mode: "metro", distance: 10, trips: 2 }; // 10 * 0.04 * 2 = 0.8
      const food: FoodEntry = { mealType: "vegetarian", delivery: false }; // 2.0
      const energy: EnergyEntry = { acHours: 0, fanHours: 0, lightsUsage: 0, devicesCharged: 0, usageStyle: "low" }; // 1.0
      const shopping: ShoppingEntry = { type: "none" }; // 0
      const waste: WasteEntry = { reusableBottle: false, plasticBottleBought: false, reusableBagUsed: false, foodWaste: false, recyclingDone: false }; // 0.5

      // total = 0.8 + 2.0 + 1.0 + 0 + 0.5 = 4.3
      expect(calculateDailyTotal(travel, food, energy, shopping, waste)).toBe(4.3);
    });
  });

  describe("calculateGreenScore", () => {
    it("keeps score inside 1 to 100 bounds", () => {
      // 0 emissions => score 100
      expect(calculateGreenScore(0)).toBe(100);
      // high emissions => score 1 (lower limit)
      expect(calculateGreenScore(50)).toBe(1);
      // intermediate emissions, e.g. 5 kg => 100 - 5 * 6.5 = 100 - 32.5 = 68 (rounded)
      expect(calculateGreenScore(5)).toBe(68);
    });
  });

  describe("generateRecommendations", () => {
    it("generates relevant suggestions based on highest footprint drivers", () => {
      const travel: TravelEntry = { mode: "car", distance: 20, trips: 2 };
      const food: FoodEntry = { mealType: "red-meat", delivery: true };
      const energy: EnergyEntry = { acHours: 5, fanHours: 10, lightsUsage: 5, devicesCharged: 2, usageStyle: "high" };
      const shopping: ShoppingEntry = { type: "electronics" };
      const waste: WasteEntry = { reusableBottle: false, plasticBottleBought: true, reusableBagUsed: false, foodWaste: true, recyclingDone: false };

      const recs = generateRecommendations(travel, food, energy, shopping, waste);
      expect(recs.length).toBeLessThanOrEqual(3);
      expect(recs[0]).toHaveProperty("title");
      expect(recs[0]).toHaveProperty("estimatedCarbonSaved");
    });
  });
});
