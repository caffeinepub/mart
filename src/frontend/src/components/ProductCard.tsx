import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { type SampleProduct, slugify } from "@/data/sampleData";
import { getProductImage } from "@/utils/productImages";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: SampleProduct;
  index?: number;
}

function getProductFallbackImage(name: string): string {
  // Use product name as keyword for a relevant fallback image
  const keyword = encodeURIComponent(
    name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(" ")
      .slice(0, 3)
      .join("+"),
  );
  // Generate a consistent hash-based seed
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash + name.charCodeAt(i)) & 0xffffffff;
  }
  const seed = Math.abs(hash) % 9999;
  return `https://loremflickr.com/400/400/${keyword}?lock=${seed}`;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addItem } = useCart();
  const { customer, toggleWishlist, isWishlisted } = useCustomer();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customer) {
      toast.info("Wishlist के लिए login करें");
      navigate({ to: "/customer-login" });
      return;
    }
    const wishlisted = isWishlisted(product.id);
    toggleWishlist({
      id: product.id,
      name: product.name,
      nameHindi: product.nameHindi,
      price: product.price,
      image: getProductImage(product),
      category: product.category,
    });
    toast.success(
      wishlisted
        ? "Wishlist से हटाया गया"
        : `${product.name} wishlist में जोड़ा! ❤️`,
    );
  };

  const discountPct = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const imageSrc = getProductImage(product);
  const wishlisted = isWishlisted(product.id);

  return (
    <Link
      to="/products/$slug"
      params={{ slug: slugify(product.name) }}
      className="group block"
      data-ocid={`product.item.${index}`}
    >
      <div className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
        {/* Image Area */}
        <div className="relative bg-gradient-to-br from-secondary to-muted flex items-center justify-center h-44 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // If image fails, use product name for a relevant fallback
              const fallback = getProductFallbackImage(product.name);
              if (e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-accent text-white text-[10px] border-0 font-semibold">
              {product.badge}
            </Badge>
          )}
          {discountPct && (
            <Badge className="absolute top-2 right-2 bg-destructive text-white text-[10px] border-0 font-semibold">
              {discountPct}% OFF
            </Badge>
          )}
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              wishlisted
                ? "bg-accent text-white"
                : "bg-white/90 text-muted-foreground hover:text-accent"
            }`}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            data-ocid={`product.wishlist.toggle.${index}`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted-foreground font-devanagari">
            {product.nameHindi}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-primary font-bold text-base">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-xs">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.stock !== undefined && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                product.stock > 10
                  ? "bg-green-100 text-green-700"
                  : product.stock > 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </span>
          )}
          <Button
            className="mt-2 w-full bg-primary hover:opacity-90 text-white text-xs h-8 gap-1.5 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            data-ocid={`product.add_to_cart.${index}`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
