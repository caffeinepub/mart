import { SAMPLE_PRODUCTS, type SampleProduct } from "@/data/sampleData";
import { useActor } from "@/hooks/useActor";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "dharma_mart_products";

function loadProducts(): SampleProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as SampleProduct[];
      }
    }
  } catch {
    // ignore
  }
  return SAMPLE_PRODUCTS;
}

function saveToLocalStorage(products: SampleProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

interface ProductsContextType {
  products: SampleProduct[];
  loading: boolean;
  addProduct: (product: SampleProduct) => void;
  updateProduct: (product: SampleProduct) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<SampleProduct[]>(loadProducts);
  const [loading, setLoading] = useState(false);
  const { actor, isFetching } = useActor();
  const backendLoaded = useRef(false);
  const saveEnabled = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!actor || isFetching || backendLoaded.current) return;
    backendLoaded.current = true;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = actor as any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (a.getProductSnapshot() as Promise<string>)
        .then((snapshot: string) => {
          if (snapshot && snapshot.length > 0) {
            try {
              const parsed = JSON.parse(snapshot) as unknown;
              if (Array.isArray(parsed) && parsed.length > 0) {
                setProducts(parsed as SampleProduct[]);
                saveToLocalStorage(parsed as SampleProduct[]);
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
          saveEnabled.current = true;
          setLoading(false);
        });
    } catch {
      saveEnabled.current = true;
      setLoading(false);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    if (!actor || !backendLoaded.current || !saveEnabled.current) return;
    saveToLocalStorage(products);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = actor as any;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (
          a.saveProductSnapshot(JSON.stringify(products)) as Promise<void>
        ).catch(() => {
          /* ignore */
        });
      } catch {
        /* ignore */
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [products, actor]);

  const addProduct = (product: SampleProduct) =>
    setProducts((prev) => [product, ...prev]);
  const updateProduct = (product: SampleProduct) =>
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  const resetProducts = () => {
    setProducts(SAMPLE_PRODUCTS);
    saveToLocalStorage(SAMPLE_PRODUCTS);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
