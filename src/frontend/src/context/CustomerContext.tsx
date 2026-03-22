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
}

export interface WishlistItem {
  id: number;
  name: string;
  nameHindi?: string;
  price: number;
  image?: string;
  category?: string;
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

  useEffect(() => {
    if (customer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
    }
  }, [customer]);

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
    const current = getWishlist(customer.id);
    const idx = current.findIndex((p) => p.id === product.id);
    let updated: WishlistItem[];
    if (idx >= 0) {
      updated = current.filter((p) => p.id !== product.id);
    } else {
      updated = [...current, product];
    }
    localStorage.setItem(key, JSON.stringify(updated));
    // Force re-render by dummy state update
    setCustomer((prev) => (prev ? { ...prev } : prev));
  };

  const isWishlisted = (productId: number): boolean => {
    if (!customer) return false;
    const list = getWishlist(customer.id);
    return list.some((p) => p.id === productId);
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
