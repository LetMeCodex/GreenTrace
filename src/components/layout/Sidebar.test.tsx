import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar, getInitials } from "./Sidebar";



describe("Sidebar getInitials Utility", () => {
  it("splits simple name to initials", () => {
    expect(getInitials("Anish Jha", null)).toBe("AJ");
    expect(getInitials("Meera", null)).toBe("ME"); // single name gets first 2 chars
  });

  it("handles email fallback name generation", () => {
    expect(getInitials(null, "rohan.sharma@example.com")).toBe("RO");
    expect(getInitials(null, "singh@test.co")).toBe("SI");
  });

  it("handles completely empty fallbacks cleanly", () => {
    expect(getInitials(null, null)).toBe("GU"); // 'GreenTrace User' split -> 'GU'
  });
});

describe("Sidebar Component Rendering", () => {
  it("renders navigation links and logo correctly", () => {
    render(<Sidebar />);

    expect(screen.getByText("GREEN")).toBeInTheDocument();
    expect(screen.getByText("TRACE")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back Home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tracker/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /AI Coach/i })).toBeInTheDocument();
  });

  it("renders profile summary badge with initials", () => {
    render(<Sidebar />);
    
    // Check initials from mock display
    expect(screen.getByText("AN")).toBeInTheDocument(); // test mock user 'Anish' + 'akj8183@gmail.com' -> initials 'AN'
    expect(screen.getByText("Anish")).toBeInTheDocument();
    expect(screen.getByText("1 Day Streak")).toBeInTheDocument();
    expect(screen.getByText("Score: 85/100")).toBeInTheDocument();
  });
});
