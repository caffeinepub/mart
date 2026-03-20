import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/data/sampleData";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Package,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const USP_ITEMS = [
  { icon: Truck, label: "Free Delivery", sub: "Above ₹499" },
  { icon: Shield, label: "Genuine Product", sub: "100% Authentic" },
  { icon: Package, label: "Easy Returns", sub: "7-day policy" },
];

export function ProductDetailPage() {
  const { slug } = useParams({ from: "/products/$slug" });
  const { addItem, items } = useCart();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-16 text-center"
        data-ocid="product.error_state"
      >
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-primary mb-2">
          Product not found
        </h2>
        <Link to="/products">
          <Button className="bg-primary text-white mt-4">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const discountPct = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8"
      data-ocid="product.detail.page"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center min-h-[320px] border border-border relative overflow-hidden"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover absolute inset-0"
              style={{ minHeight: 320 }}
            />
          ) : (
            <span className="text-[120px]">{product.emoji}</span>
          )}
          {product.badge && (
            <Badge className="absolute top-4 left-4 bg-accent text-white border-0 text-sm">
              {product.badge}
            </Badge>
          )}
          {discountPct && (
            <Badge className="absolute top-4 right-4 bg-destructive text-white border-0 text-sm">
              {discountPct}% OFF
            </Badge>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <h1 className="text-2xl font-bold text-foreground mt-1">
              {product.name}
            </h1>
            <p className="font-devanagari text-muted-foreground mt-0.5">
              {product.nameHindi}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {["s1", "s2", "s3", "s4", "s5"].map((key, i) => (
              <Star
                key={key}
                className={`h-4 w-4 ${i < 4 ? "fill-accent text-accent" : "text-muted-foreground"}`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              (128 reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-muted-foreground line-through text-lg">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-destructive font-bold">
                  Save {discountPct}%
                </span>
              </>
            )}
          </div>

          <p className="text-foreground/80 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="text-sm">
            <span
              className={`font-semibold ${product.stock > 20 ? "text-green-600" : "text-destructive"}`}
            >
              {product.stock > 20
                ? `✅ In Stock (${product.stock} available)`
                : `⚠️ Only ${product.stock} left!`}
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary hover:opacity-90 text-white h-12 text-base gap-2"
              onClick={handleAddToCart}
              data-ocid="product.add_to_cart.primary_button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItem
                ? `Add Again (${cartItem.quantity} in cart)`
                : "Add to Cart"}
            </Button>
            <Link to="/cart" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 text-base border-primary text-primary hover:bg-primary hover:text-white"
                data-ocid="product.buy_now.secondary_button"
              >
                Buy Now
              </Button>
            </Link>
          </div>

          {/* USP Row */}
          <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
            {USP_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-1"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <Link to="/products">
          <Button
            variant="outline"
            className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
