"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { onboardingApi } from "@/features/onboarding/api/onboarding.api";
import type { OnboardingProcess } from "@/features/onboarding/types/onboarding.types";

const statusStyles: Record<string, string> = {
  NotStarted: "text-[var(--color-text-faint)]",
  InProgress: "text-[var(--color-warning)]",
  Completed: "text-[var(--color-success)]",
};

export function OnboardingProcessCard({
  process,
  employeeName,
  onChange,
}: {
  process: OnboardingProcess;
  employeeName: string;
  onChange: (updated: OnboardingProcess) => void;
}) {
  const [busyStep, setBusyStep] = useState<string | null>(null);

  async function toggle(stepId: string, completed: boolean) {
    setBusyStep(stepId);
    try {
      const updated = await onboardingApi.setStep(process.companyId, process.id, stepId, completed);
      onChange(updated);
    } finally {
      setBusyStep(null);
    }
  }

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
            {employeeName}
          </h3>
          <p className="text-xs text-[var(--color-text-faint)]">{process.templateName}</p>
        </div>
        <span className={`text-xs font-medium ${statusStyles[process.status] ?? ""}`}>
          {process.status.replace(/([a-z])([A-Z])/g, "$1 $2")}
        </span>
      </div>

      <div className="mt-4">
        <ProgressBar value={process.completedSteps} total={process.totalSteps} />
      </div>

      <ul className="mt-5 space-y-1.5">
        {process.steps.map((step) => (
          <li key={step.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[var(--color-surface-2)]">
              <input
                type="checkbox"
                checked={step.isCompleted}
                disabled={busyStep === step.id}
                onChange={(e) => toggle(step.id, e.target.checked)}
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              <span
                className={
                  step.isCompleted
                    ? "text-sm text-[var(--color-text-faint)] line-through"
                    : "text-sm text-[var(--color-text)]"
                }
              >
                {step.name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
