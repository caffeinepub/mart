import { type ReactNode, createContext, useContext, useState } from "react";

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  active: boolean;
}

interface CouponContextValue {
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, allCoupons: Coupon[]) => string | null;
  clearCoupon: () => void;
  calcDiscount: (subtotal: number) => number;
}

const CouponContext = createContext<CouponContextValue | null>(null);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = (code: string, allCoupons: Coupon[]): string | null => {
    const coupon = allCoupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.active,
    );
    if (!coupon) return "Invalid or expired coupon code.";
    setAppliedCoupon(coupon);
    return null;
  };

  const clearCoupon = () => setAppliedCoupon(null);

  const calcDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent")
      return Math.round((subtotal * appliedCoupon.value) / 100);
    return Math.min(appliedCoupon.value, subtotal);
  };

  return (
    <CouponContext.Provider
      value={{ appliedCoupon, applyCoupon, clearCoupon, calcDiscount }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupon must be inside CouponProvider");
  return ctx;
}
