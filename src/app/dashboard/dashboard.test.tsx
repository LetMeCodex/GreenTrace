import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "./page";

import { mockUseApp } from "../../test/setup";

describe("Dashboard Component Tests", () => {
  it("renders correctly with typical user entries", () => {
    render(<Dashboard />);

    // Check user comparison greeting
    expect(screen.getByText(/Anish, your footprint/i)).toBeInTheDocument();
    
    // Check main dashboard cards
    expect(screen.getByText("Weekly Carbon Plan")).toBeInTheDocument();
    expect(screen.getByText("Carbon Impact")).toBeInTheDocument();
    expect(screen.getByText("WEEKLY REPORT")).toBeInTheDocument();
    expect(screen.getByText("GREEN SCORE")).toBeInTheDocument();

    // Check custom calculated fields from mock
    expect(screen.getByText(/4\.8/)).toBeInTheDocument(); // totalCO2e of today's entry
    expect(screen.getAllByText(/85/)[0]).toBeInTheDocument(); // greenScore of today's entry
  });

  it("handles fallback layout values cleanly when there are no entries", () => {
    // Override context to return zero entries
    mockUseApp.mockImplementationOnce(() => ({
      user: { id: "test-user-123", name: "Anish", email: "akj8183@gmail.com" },
      sessionUser: { id: "test-user-123" },
      entries: [], // no entries today
      actions: [],
      challenges: [],
      badges: [],
      completeOnboarding: vi.fn(),
      saveDailyEntry: vi.fn(),
      updateUserProfile: vi.fn(),
      resetAllData: vi.fn(),
      signOutUser: vi.fn(),
      loading: false,
      isSupabase: true,
    }));

    render(<Dashboard />);

    // Check it still displays without crash
    expect(screen.getByText("START TODAY'S TRACE")).toBeInTheDocument();
    expect(screen.getByText(/0\.0/)).toBeInTheDocument(); // Today's footprint falls back to 0.0
    expect(screen.getByText("100")).toBeInTheDocument(); // Green score falls back to 100
  });
});
