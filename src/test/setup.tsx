import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// 1. Mock next/navigation globally
vi.mock("next/navigation", () => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  };
  return {
    useRouter: () => router,
    usePathname: () => "/dashboard",
    useSearchParams: () => new URLSearchParams(),
  };
});

// 2. Mock Supabase client globally
vi.mock("@/lib/supabaseClient", () => {
  const mockAuth = {
    getSession: vi.fn(() => Promise.resolve({ data: { session: { user: { id: "test-user-123", email: "akj8183@gmail.com" } } }, error: null })),
    signInWithPassword: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  };

  const mockSupabase = {
    auth: mockAuth,
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  };

  return {
    createClient: () => mockSupabase,
    supabase: mockSupabase,
    isSupabaseConfigured: true,
  };
});

// 3. Mock Supabase server utilities globally
vi.mock("@/utils/supabase/server", () => {
  const mockSupabase = {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      exchangeCodeForSession: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    },
  };
  return {
    createClient: () => Promise.resolve(mockSupabase),
  };
});

// 4. Mock AppContext useApp hook globally
export const mockUseApp = vi.fn(() => ({
  user: {
    id: "test-user-123",
    name: "Anish",
    email: "akj8183@gmail.com",
    city: "Bengaluru",
    householdSize: 1,
    mainTransportMode: "metro",
    dietType: "Mostly vegetarian",
    createdAt: new Date().toISOString(),
  },
  sessionUser: { id: "test-user-123", email: "akj8183@gmail.com" },
  entries: [
    {
      id: "entry-1",
      date: new Date().toISOString().split("T")[0],
      totalCO2e: 4.8,
      greenScore: 85,
      biggestSource: "Food & Diet",
      travel: { mode: "walk", distance: 2, trips: 1 },
      food: { mealType: "vegetarian", delivery: false },
      energy: { acHours: 0, fanHours: 6, lightsUsage: 5, devicesCharged: 3, usageStyle: "low" },
      shopping: { type: "none" },
      waste: { reusableBottle: true, plasticBottleBought: false, reusableBagUsed: true, foodWaste: false, recyclingDone: true }
    }
  ],
  actions: [
    { id: "act-1", title: "Unplug standbys", category: "energy", difficulty: "Easy", estimatedCarbonSaved: 0.2, estimatedMoneySaved: 15, completed: true }
  ],
  challenges: [],
  badges: [
    { id: "badge-1", title: "Eco Beginner", description: "Log your first carbon entry", unlocked: true, icon: "Footprint" }
  ],
  completeOnboarding: vi.fn(),
  saveDailyEntry: vi.fn(),
  updateUserProfile: vi.fn(),
  resetAllData: vi.fn(),
  signOutUser: vi.fn(),
  loading: false,
  isSupabase: true,
}));

// Mock both relative path imports to AppContext
vi.mock("../../context/AppContext", () => ({
  useApp: () => mockUseApp(),
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../context/AppContext", () => ({
  useApp: () => mockUseApp(),
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/context/AppContext", () => ({
  useApp: () => mockUseApp(),
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
