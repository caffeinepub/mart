import { Button } from "@/components/ui/button";
import { useCustomer } from "@/context/CustomerContext";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";

export function MyAccountPage() {
  const { customer, logout, wishlistItems } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      navigate({ to: "/customer-login" });
    }
  }, [customer, navigate]);

  if (!customer) return null;

  const handleLogout = () => {
    logout();
    toast.success("लॉग आउट हो गए। फिर आइए! 🙏");
    navigate({ to: "/" });
  };

  const formattedDate = new Date(customer.registeredAt).toLocaleDateString(
    "hi-IN",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8"
      data-ocid="customer.account.page"
    >
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6"
      >
        <div className="bg-primary px-6 py-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">
              {customer.name}
            </h1>
            <p className="text-white/70 text-sm flex items-center gap-1 mt-0.5">
              <Phone className="h-3.5 w-3.5" />
              {customer.mobile}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/40 text-white hover:bg-white/20 hover:text-white gap-1.5 flex-shrink-0"
            onClick={handleLogout}
            data-ocid="customer.logout.button"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </Button>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                पता / Address
              </p>
              <p className="text-sm text-foreground">{customer.address}</p>
              <p className="text-sm font-semibold text-primary">
                {customer.city}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <User className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                Registered
              </p>
              <p className="text-sm text-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link to="/cart">
          <Button
            variant="outline"
            className="w-full h-14 border-primary text-primary hover:bg-primary hover:text-white gap-2 font-semibold"
            data-ocid="customer.cart.button"
          >
            <ShoppingCart className="h-5 w-5" /> My Cart
          </Button>
        </Link>
        <Link to="/order-tracking">
          <Button
            variant="outline"
            className="w-full h-14 border-primary text-primary hover:bg-primary hover:text-white gap-2 font-semibold"
            data-ocid="customer.orders.button"
          >
            <Package className="h-5 w-5" /> My Orders
          </Button>
        </Link>
        <Link to="/products">
          <Button
            className="w-full h-14 bg-accent hover:opacity-90 text-white gap-2 font-semibold"
            data-ocid="customer.shop.button"
          >
            🛒 Shop Now
          </Button>
        </Link>
      </div>

      {/* Wishlist Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <Heart className="h-5 w-5 text-accent fill-accent" />
          <h2 className="font-bold text-foreground">
            My Wishlist / मेरी विशलिस्ट
          </h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {wishlistItems.length} items
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div
            className="text-center py-12 px-6"
            data-ocid="customer.wishlist.empty_state"
          >
            <div className="text-5xl mb-3">💝</div>
            <p className="text-muted-foreground font-medium">
              आपकी wishlist खाली है
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Products browse करें और heart icon ❤️ click करें
            </p>
            <Link to="/products">
              <Button
                className="mt-4 bg-accent hover:opacity-90 text-white"
                data-ocid="customer.wishlist.shop.button"
              >
                Products देखें
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {wishlistItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 px-6 py-4"
                data-ocid={`customer.wishlist.item.${idx + 1}`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🛒
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.category}
                  </p>
                  <p className="text-primary font-bold text-sm mt-0.5">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <Link
                  to="/products/$slug"
                  params={{
                    slug: item.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  }}
                >
                  <Button
                    size="sm"
                    className="bg-primary hover:opacity-90 text-white h-8 text-xs"
                  >
                    View
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
