import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  };
  return {
    useRouter: () => router,
    usePathname: () => "/login",
    useSearchParams: () => new URLSearchParams(),
  };
});

import LoginPage from "./page";

// Load Next.js and Supabase mocks
import { createClient } from "@/lib/supabaseClient";

describe("LoginPage Component Tests", () => {
  it("renders email and password inputs and buttons correctly", () => {
    render(<LoginPage />);

    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue with Google/i })).toBeInTheDocument();
  });

  it("calls email login method on form submit", async () => {
    const mockSupabase = createClient();
    const loginSpy = vi.spyOn(mockSupabase.auth, "signInWithPassword");

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("calls OAuth provider methods when Google login clicked", async () => {
    const mockSupabase = createClient();
    const oauthSpy = vi.spyOn(mockSupabase.auth, "signInWithOAuth");

    render(<LoginPage />);

    const googleBtn = screen.getByRole("button", { name: /Continue with Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(oauthSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: "google",
        })
      );
    });
  });
});
