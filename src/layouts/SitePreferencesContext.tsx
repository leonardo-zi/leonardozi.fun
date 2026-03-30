import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "cn" | "en";

type SitePreferencesValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const SitePreferencesContext = createContext<SitePreferencesValue | null>(null);

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "cn";
    const saved = window.localStorage.getItem("lang");
    return saved === "en" ? "en" : "cn";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("lang", lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

export function useSitePreferences(): SitePreferencesValue {
  const ctx = useContext(SitePreferencesContext);
  if (!ctx) throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  return ctx;
}
