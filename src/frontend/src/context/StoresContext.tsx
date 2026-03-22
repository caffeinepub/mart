import { SAMPLE_STORES, type SampleStore } from "@/data/sampleData";
import { useActor } from "@/hooks/useActor";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "dharma_mart_stores";

function loadStores(): SampleStore[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as SampleStore[];
      }
    }
  } catch {
    // ignore
  }
  return SAMPLE_STORES;
}

function saveToLocalStorage(stores: SampleStore[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  } catch {
    // ignore
  }
}

interface StoresContextType {
  stores: SampleStore[];
  loading: boolean;
  addStore: (store: Omit<SampleStore, "id">) => void;
  updateStore: (store: SampleStore) => void;
  deleteStore: (id: number) => void;
}

const StoresContext = createContext<StoresContextType | null>(null);

export function StoresProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<SampleStore[]>(loadStores);
  const [loading, setLoading] = useState(false);
  const { actor, isFetching } = useActor();
  const backendLoaded = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!actor || isFetching || backendLoaded.current) return;
    backendLoaded.current = true;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = actor as any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (a.getStoreSnapshot() as Promise<string>)
        .then((snapshot: string) => {
          if (snapshot && snapshot.length > 0) {
            try {
              const parsed = JSON.parse(snapshot) as unknown;
              if (Array.isArray(parsed) && parsed.length > 0) {
                setStores(parsed as SampleStore[]);
                saveToLocalStorage(parsed as SampleStore[]);
              }
            } catch {
              // ignore
            }
          }
        })
        .catch(() => {
          /* ignore */
        })
        .finally(() => {
          setLoading(false);
        });
    } catch {
      setLoading(false);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    saveToLocalStorage(stores);
    if (!actor || !backendLoaded.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = actor as any;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (a.saveStoreSnapshot(JSON.stringify(stores)) as Promise<void>).catch(
          () => {
            /* ignore */
          },
        );
      } catch {
        /* ignore */
      }
    }, 100);
    // No cleanup on unmount - we want the save to complete even when navigating away
  }, [stores, actor]);

  const addStore = (store: Omit<SampleStore, "id">) => {
    const newStore: SampleStore = { ...store, id: Date.now() };
    setStores((prev) => [...prev, newStore]);
  };
  const updateStore = (store: SampleStore) =>
    setStores((prev) => prev.map((s) => (s.id === store.id ? store : s)));
  const deleteStore = (id: number) =>
    setStores((prev) => prev.filter((s) => s.id !== id));

  return (
    <StoresContext.Provider
      value={{ stores, loading, addStore, updateStore, deleteStore }}
    >
      {children}
    </StoresContext.Provider>
  );
}

export function useStores() {
  const ctx = useContext(StoresContext);
  if (!ctx) throw new Error("useStores must be used within StoresProvider");
  return ctx;
}
