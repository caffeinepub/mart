import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useCoupon } from "@/context/CouponContext";
import { useCustomer } from "@/context/CustomerContext";
import { useActor } from "@/hooks/useActor";
import { useMetaTags } from "@/hooks/useMetaTags";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Loader2, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_COUPONS = [
  { code: "DHARMA10", type: "percent" as const, value: 10, active: true },
  { code: "DHARMA20", type: "percent" as const, value: 20, active: true },
  { code: "WELCOME50", type: "flat" as const, value: 50, active: true },
];

export function CheckoutPage() {
  useMetaTags({
    title: "Checkout",
    description: "Securely place your order at धर्मा Mart",
  });
  const { items, totalPrice, clearCart } = useCart();
  const { customer } = useCustomer();
  const { appliedCoupon, applyCoupon, clearCoupon, calcDiscount } = useCoupon();
  const { actor } = useActor();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.mobile || "",
    address: customer?.address || "",
    city: customer?.city || "",
    pin: "",
  });
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [placing, setPlacing] = useState(false);

  const delivery = totalPrice >= 499 ? 0 : 49;
  const discount = calcDiscount(totalPrice);
  const finalTotal = totalPrice + delivery - discount;

  const handleApplyCoupon = async () => {
    setCouponError("");
    let coupons = DEFAULT_COUPONS;
    try {
      if (actor) {
        const raw = await (actor as any).getCouponsSnapshot();
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) coupons = parsed;
      }
    } catch {}
    const err = applyCoupon(couponInput, coupons);
    if (err) {
      setCouponError(err);
    } else {
      toast.success("Coupon applied! 🎉");
    }
  };

  const handleConfirmOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pin) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setPlacing(true);
    try {
      const orderId = Date.now().toString();
      const order = {
        id: orderId,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pin: form.pin,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        total: finalTotal,
        discount,
        coupon: appliedCoupon?.code || null,
        status: "Placed",
        date: new Date().toISOString(),
      };

      if (actor) {
        try {
          const existing = await (actor as any).getOrdersSnapshot();
          let orders: any[] = [];
          try {
            orders = JSON.parse(existing);
          } catch {}
          orders.push(order);
          await (actor as any).saveOrdersSnapshot(JSON.stringify(orders));
        } catch {
          const stored = localStorage.getItem("dharma_orders") || "[]";
          const orders = JSON.parse(stored);
          orders.push(order);
          localStorage.setItem("dharma_orders", JSON.stringify(orders));
        }
      } else {
        const stored = localStorage.getItem("dharma_orders") || "[]";
        const orders = JSON.parse(stored);
        orders.push(order);
        localStorage.setItem("dharma_orders", JSON.stringify(orders));
      }

      clearCart();
      clearCoupon();
      navigate({ to: "/order-tracking", search: { success: "true", orderId } });
    } catch {
      toast.error("Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-20 text-center"
        data-ocid="checkout.empty_state"
      >
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-primary mb-2">Cart is empty</h2>
        <Link to="/products">
          <Button className="bg-primary text-white mt-4">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="checkout.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cart">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-primary text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">Checkout / ऑर्डर करें</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-5"
        >
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-bold text-primary mb-4">📦 Delivery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="co-name">Full Name *</Label>
                <Input
                  id="co-name"
                  className="mt-1"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Your full name"
                  data-ocid="checkout.name.input"
                />
              </div>
              <div>
                <Label htmlFor="co-phone">Phone *</Label>
                <Input
                  id="co-phone"
                  className="mt-1"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="10-digit mobile"
                  data-ocid="checkout.phone.input"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="co-address">Address *</Label>
                <Input
                  id="co-address"
                  className="mt-1"
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="House no, street, locality"
                  data-ocid="checkout.address.input"
                />
              </div>
              <div>
                <Label htmlFor="co-city">City *</Label>
                <Input
                  id="co-city"
                  className="mt-1"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="City"
                  data-ocid="checkout.city.input"
                />
              </div>
              <div>
                <Label htmlFor="co-pin">PIN Code *</Label>
                <Input
                  id="co-pin"
                  className="mt-1"
                  value={form.pin}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pin: e.target.value }))
                  }
                  placeholder="6-digit PIN"
                  maxLength={6}
                  data-ocid="checkout.pin.input"
                />
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-bold text-primary mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" /> Apply Coupon
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code (e.g. DHARMA10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1"
                data-ocid="checkout.coupon.input"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-primary text-white"
                data-ocid="checkout.coupon.primary_button"
              >
                Apply
              </Button>
              {appliedCoupon && (
                <Button
                  variant="outline"
                  onClick={() => {
                    clearCoupon();
                    setCouponInput("");
                  }}
                  className="text-destructive border-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
            {couponError && (
              <p
                className="text-sm text-destructive mt-2"
                data-ocid="checkout.coupon.error_state"
              >
                {couponError}
              </p>
            )}
            {appliedCoupon && (
              <p
                className="text-sm text-green-600 font-semibold mt-2"
                data-ocid="checkout.coupon.success_state"
              >
                ✅ Coupon "{appliedCoupon.code}" applied —{" "}
                {appliedCoupon.type === "percent"
                  ? `${appliedCoupon.value}% off`
                  : `₹${appliedCoupon.value} off`}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Try: DHARMA10, DHARMA20, WELCOME50
            </p>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div
            className="bg-card border border-border rounded-xl p-5 sticky top-24"
            data-ocid="checkout.summary.card"
          >
            <h3 className="font-bold text-primary uppercase tracking-wider mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm max-h-52 overflow-y-auto mb-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold flex-shrink-0">
                    ₹
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span
                  className={
                    delivery === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                <span>Total</span>
                <span className="text-primary">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-accent hover:opacity-90 text-white font-bold h-12 text-base gap-2"
              onClick={handleConfirmOrder}
              disabled={placing}
              data-ocid="checkout.confirm.primary_button"
            >
              {placing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {placing ? "Placing Order..." : "Confirm Order"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              🔒 Secure Checkout
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
