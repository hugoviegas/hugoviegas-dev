import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ContentCollection } from "@/content/types";
import { loadExistingContent, type ExistingSettings } from "./adminContent";
import { ADMIN_COLLECTIONS } from "./collectionConfig";

// Counts for the rail and the overview, plus the settings doc. Loaded once
// when the admin opens; panels report fresh counts after their own loads.

export type Counts = Record<ContentCollection, { published: number; drafts: number }>;

interface SummaryValue {
  counts: Counts | null;
  settings: ExistingSettings | null;
  error: string | null;
  reload: () => Promise<void>;
  reportCounts: (collection: ContentCollection, published: boolean[]) => void;
  reportSettings: (settings: ExistingSettings | null) => void;
}

const SummaryContext = createContext<SummaryValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components -- hook beside its provider
export const useAdminSummary = () => {
  const value = useContext(SummaryContext);
  if (!value) throw new Error("useAdminSummary must be used inside AdminSummaryProvider");
  return value;
};

const countOf = (published: boolean[]) => {
  const count = published.filter(Boolean).length;
  return { published: count, drafts: published.length - count };
};

export const AdminSummaryProvider = ({ children, autoLoad = true }: { children: ReactNode; autoLoad?: boolean }) => {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [settings, setSettings] = useState<ExistingSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const { docs, settings: loaded } = await loadExistingContent();
      const next = {} as Counts;
      for (const name of ADMIN_COLLECTIONS) {
        next[name] = countOf(Object.values(docs[name] ?? {}).map((item) => item.data.published === true));
      }
      setCounts(next);
      setSettings(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    if (autoLoad) void reload();
  }, [autoLoad, reload]);

  const reportCounts = useCallback((collection: ContentCollection, published: boolean[]) => {
    setCounts((current) => (current ? { ...current, [collection]: countOf(published) } : current));
  }, []);

  const value = useMemo(
    () => ({ counts, settings, error, reload, reportCounts, reportSettings: setSettings }),
    [counts, settings, error, reload, reportCounts],
  );

  return <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>;
};
