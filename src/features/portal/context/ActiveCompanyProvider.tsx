"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/components/AuthProvider";
import type { Membership } from "@/features/auth/types/auth.types";
import { companiesApi } from "@/features/companies/api/companies.api";

const STORAGE_KEY = "be.activeCompany";

interface ActiveCompanyContextValue {
  companies: Membership[];
  activeCompanyId: string | null;
  activeCompany: Membership | null;
  setActiveCompany: (companyId: string) => void;
}

const ActiveCompanyContext = createContext<ActiveCompanyContextValue | undefined>(undefined);

export function ActiveCompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const memberships = useMemo(() => user?.companies ?? [], [user]);
  const [allCompanies, setAllCompanies] = useState<Membership[] | null>(null);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  // Platform admins may operate in any company, not just explicit memberships.
  useEffect(() => {
    if (!user?.isPlatformAdmin) {
      setAllCompanies(null);
      return;
    }
    let cancelled = false;
    companiesApi
      .list()
      .then((companies) => {
        if (cancelled) return;
        const byId = new Map(memberships.map((m) => [m.companyId, m]));
        setAllCompanies(
          companies.map((c) => {
            const existing = byId.get(c.id);
            return {
              companyId: c.id,
              companyName: c.name,
              companySlug: c.slug,
              isPrimary: existing?.isPrimary ?? false,
              roles: existing?.roles ?? ["Platform Admin"],
            };
          }),
        );
      })
      .catch(() => setAllCompanies(null));
    return () => {
      cancelled = true;
    };
  }, [user?.isPlatformAdmin, memberships]);

  const companies = allCompanies ?? memberships;

  // Choose an active company: stored choice if still valid, else primary, else first.
  useEffect(() => {
    if (companies.length === 0) {
      setActiveCompanyId(null);
      return;
    }
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    const valid = stored && companies.some((c) => c.companyId === stored) ? stored : null;
    const primary = companies.find((c) => c.isPrimary) ?? companies[0];
    setActiveCompanyId(valid ?? primary.companyId);
  }, [companies]);

  function setActiveCompany(companyId: string) {
    setActiveCompanyId(companyId);
    try {
      localStorage.setItem(STORAGE_KEY, companyId);
    } catch {
      /* ignore */
    }
  }

  const activeCompany = companies.find((c) => c.companyId === activeCompanyId) ?? null;

  return (
    <ActiveCompanyContext.Provider
      value={{ companies, activeCompanyId, activeCompany, setActiveCompany }}
    >
      {children}
    </ActiveCompanyContext.Provider>
  );
}

export function useActiveCompany(): ActiveCompanyContextValue {
  const ctx = useContext(ActiveCompanyContext);
  if (!ctx) throw new Error("useActiveCompany must be used within an ActiveCompanyProvider");
  return ctx;
}
