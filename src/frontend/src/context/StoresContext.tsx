import { SAMPLE_STORES, type SampleStore } from "@/data/sampleData";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "dharma_mart_stores";

function loadStores(): SampleStore[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SampleStore[];
    }
  } catch {
    // ignore
  }
  return SAMPLE_STORES;
}

function saveStores(stores: SampleStore[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  } catch {
    // ignore
  }
}

interface StoresContextType {
  stores: SampleStore[];
  addStore: (store: Omit<SampleStore, "id">) => void;
  updateStore: (store: SampleStore) => void;
  deleteStore: (id: number) => void;
}

const StoresContext = createContext<StoresContextType | null>(null);

export function StoresProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<SampleStore[]>(loadStores);

  useEffect(() => {
    saveStores(stores);
  }, [stores]);

  const addStore = (store: Omit<SampleStore, "id">) => {
    const newStore: SampleStore = { ...store, id: Date.now() };
    setStores((prev) => [...prev, newStore]);
  };

  const updateStore = (store: SampleStore) => {
    setStores((prev) => prev.map((s) => (s.id === store.id ? store : s)));
  };

  const deleteStore = (id: number) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StoresContext.Provider
      value={{ stores, addStore, updateStore, deleteStore }}
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
