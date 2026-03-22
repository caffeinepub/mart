import { createContext, useContext, useEffect, useState } from "react";

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  registeredAt: string;
}

const CUSTOMER_KEY = "dharma_customer";
const ALL_CUSTOMERS_KEY = "dharma_all_customers";

export interface WishlistItem {
  id: number;
  name: string;
  nameHindi?: string;
  price: number;
  image?: string;
  category?: string;
}

interface CustomerContextType {
  customer: Customer | null;
  login: (c: Customer) => void;
  logout: () => void;
  allCustomers: Customer[];
  saveCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  getWishlist: (customerId: string) => WishlistItem[];
  toggleWishlist: (product: WishlistItem) => void;
  isWishlisted: (productId: number) => boolean;
  wishlistItems: WishlistItem[];
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [allCustomers, setAllCustomers] = useState<Customer[]>(() => {
    try {
      const raw = localStorage.getItem(ALL_CUSTOMERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      const cust = raw ? JSON.parse(raw) : null;
      if (!cust) return [];
      const wRaw = localStorage.getItem(`dharma_wishlist_${cust.id}`);
      return wRaw ? JSON.parse(wRaw) : [];
    } catch {
      return [];
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only re-run when customer id changes
  useEffect(() => {
    if (customer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
      // Load wishlist for this customer
      try {
        const wRaw = localStorage.getItem(`dharma_wishlist_${customer.id}`);
        setWishlistItems(wRaw ? JSON.parse(wRaw) : []);
      } catch {
        setWishlistItems([]);
      }
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
      setWishlistItems([]);
    }
  }, [customer?.id]);

  useEffect(() => {
    localStorage.setItem(ALL_CUSTOMERS_KEY, JSON.stringify(allCustomers));
  }, [allCustomers]);

  const login = (c: Customer) => {
    setCustomer(c);
  };

  const logout = () => {
    setCustomer(null);
  };

  const saveCustomer = (c: Customer) => {
    setAllCustomers((prev) => {
      const exists = prev.findIndex((x) => x.mobile === c.mobile);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = c;
        return updated;
      }
      return [...prev, c];
    });
  };

  const deleteCustomer = (id: string) => {
    setAllCustomers((prev) => prev.filter((c) => c.id !== id));
    if (customer?.id === id) setCustomer(null);
  };

  const getWishlist = (customerId: string): WishlistItem[] => {
    try {
      const raw = localStorage.getItem(`dharma_wishlist_${customerId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const toggleWishlist = (product: WishlistItem) => {
    if (!customer) return;
    const key = `dharma_wishlist_${customer.id}`;
    setWishlistItems((current) => {
      const idx = current.findIndex((p) => p.id === product.id);
      const updated =
        idx >= 0
          ? current.filter((p) => p.id !== product.id)
          : [...current, product];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (productId: number): boolean => {
    return wishlistItems.some((p) => p.id === productId);
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        login,
        logout,
        allCustomers,
        saveCustomer,
        deleteCustomer,
        getWishlist,
        toggleWishlist,
        isWishlisted,
        wishlistItems,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be inside CustomerProvider");
  return ctx;
}
