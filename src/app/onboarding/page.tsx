"use client";

import React from "react";
import { OnboardingFlow } from "../../components/onboarding/OnboardingFlow";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <OnboardingFlow />
      </div>
    </div>
  );
}
