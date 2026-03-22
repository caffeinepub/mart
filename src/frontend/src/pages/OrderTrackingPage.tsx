import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/context/CustomerContext";
import { useActor } from "@/hooks/useActor";
import { useMetaTags } from "@/hooks/useMetaTags";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
  items: OrderItem[];
  total: number;
  discount: number;
  coupon?: string | null;
  status: "Placed" | "Processing" | "Shipped" | "Delivered";
  date: string;
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  Placed: { bg: "bg-blue-100", text: "text-blue-700", label: "Placed" },
  Processing: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Processing",
  },
  Shipped: { bg: "bg-orange-100", text: "text-orange-700", label: "Shipped" },
  Delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
};

export function OrderTrackingPage() {
  useMetaTags({
    title: "My Orders",
    description: "Track your orders at धर्मा Mart",
  });
  const { customer } = useCustomer();
  const { actor } = useActor();
  const search = useSearch({ from: "/order-tracking" }) as {
    success?: string;
    orderId?: string;
  };
  const isSuccess = search.success === "true";
  const successOrderId = search.orderId;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        let raw: string | null = null;
        if (actor) {
          try {
            raw = await (actor as any).getOrdersSnapshot();
          } catch {}
        }
        if (!raw) raw = localStorage.getItem("dharma_orders");
        if (raw) {
          const parsed: Order[] = JSON.parse(raw);
          if (customer) {
            setOrders(
              parsed.filter((o) => o.phone === customer.mobile).reverse(),
            );
          } else if (isSuccess && successOrderId) {
            setOrders(parsed.filter((o) => o.id === successOrderId));
          } else {
            setOrders([]);
          }
        }
      } catch {}
      setLoading(false);
    };
    loadOrders();
  }, [actor, customer, isSuccess, successOrderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-ocid="orders.page">
      <AnimatePresence>
        {isSuccess && successOrderId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-center gap-4"
            data-ocid="orders.success_state"
          >
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800 text-lg">
                Order Placed Successfully! 🎉
              </p>
              <p className="text-sm text-green-700">
                Order ID:{" "}
                <span className="font-mono font-semibold">
                  {successOrderId}
                </span>
              </p>
              <p className="text-sm text-green-600 mt-1">
                आपका ऑर्डर मिल गया। जल्द ही deliver होगा!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
        <Package className="h-6 w-6" /> My Orders / मेरे ऑर्डर
      </h1>

      {!customer && !isSuccess && (
        <div className="text-center py-16" data-ocid="orders.login.card">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">
            Login करें अपने orders देखने के लिए
          </p>
          <Link to="/customer-login">
            <Button
              className="bg-primary text-white mt-4"
              data-ocid="orders.login.primary_button"
            >
              Customer Login
            </Button>
          </Link>
        </div>
      )}

      {loading && (
        <div className="text-center py-12" data-ocid="orders.loading_state">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-3 text-muted-foreground">Loading orders...</p>
        </div>
      )}

      {!loading && orders.length === 0 && (customer || isSuccess) && (
        <div className="text-center py-16" data-ocid="orders.empty_state">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">
            No orders yet
          </p>
          <Link to="/products">
            <Button className="bg-accent text-white mt-4">Shop Now</Button>
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order, idx) => {
          const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.Placed;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
              data-ocid={`orders.item.${idx + 1}`}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                <div>
                  <p className="font-bold text-sm">
                    Order #{order.id.slice(-8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                >
                  {style.label}
                </span>
              </div>
              <div className="px-5 py-3">
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div
                      key={`${item.name}-${i}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <p>
                      {order.address}, {order.city} - {order.pin}
                    </p>
                    {order.coupon && (
                      <p className="text-green-600">Coupon: {order.coupon}</p>
                    )}
                  </div>
                  <p className="font-bold text-primary text-base">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
