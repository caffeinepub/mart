import { SAMPLE_PRODUCTS, type SampleProduct } from "@/data/sampleData";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "dharma_mart_products";

function loadProducts(): SampleProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SampleProduct[];
    }
  } catch {
    // ignore
  }
  return SAMPLE_PRODUCTS;
}

function saveProducts(products: SampleProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

interface ProductsContextType {
  products: SampleProduct[];
  addProduct: (product: SampleProduct) => void;
  updateProduct: (product: SampleProduct) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<SampleProduct[]>(loadProducts);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const addProduct = (product: SampleProduct) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (product: SampleProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetProducts = () => {
    setProducts(SAMPLE_PRODUCTS);
    saveProducts(SAMPLE_PRODUCTS);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
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
