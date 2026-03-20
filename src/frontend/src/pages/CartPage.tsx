import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

export function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    toast.success(
      "🎉 Order placed successfully! You'll receive a confirmation shortly.",
    );
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-20 text-center"
        data-ocid="cart.empty_state"
      >
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">आपका कार्ट खाली है। कुछ जोड़ें!</p>
        <Link to="/products">
          <Button className="bg-primary text-white px-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="cart.page">
      <h1 className="section-title mb-6">
        Shopping Cart | कार्ट ({totalItems} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center"
                data-ocid={`cart.item.${idx + 1}`}
              >
                <div className="text-4xl w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-devanagari">
                    {item.product.nameHindi}
                  </p>
                  <p className="text-primary font-bold mt-1">
                    ₹{item.product.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    data-ocid={`cart.qty_minus.${idx + 1}`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    data-ocid={`cart.qty_plus.${idx + 1}`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    ₹
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                  <button
                    type="button"
                    className="text-destructive hover:opacity-70 transition-opacity mt-1"
                    onClick={() => removeItem(item.product.id)}
                    data-ocid={`cart.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-2">
            <Link to="/products">
              <Button
                variant="outline"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
              onClick={() => {
                clearCart();
                toast.info("Cart cleared.");
              }}
              data-ocid="cart.clear.delete_button"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className="bg-card border border-border rounded-lg p-5 sticky top-24"
            data-ocid="cart.order_summary.card"
          >
            <h3 className="font-bold text-primary uppercase tracking-wider mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-semibold">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charges</span>
                <span className="font-semibold text-green-600">
                  {totalPrice >= 499 ? "FREE" : "₹49"}
                </span>
              </div>
              {totalPrice < 499 && (
                <p className="text-xs text-accent">
                  Add ₹{(499 - totalPrice).toLocaleString("en-IN")} more for
                  free delivery!
                </p>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">
                  ₹
                  {(totalPrice + (totalPrice >= 499 ? 0 : 49)).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-accent hover:opacity-90 text-white font-bold h-12 text-base gap-2"
              onClick={handleCheckout}
              data-ocid="cart.checkout.primary_button"
            >
              Place Order <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              🔒 Safe & Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
