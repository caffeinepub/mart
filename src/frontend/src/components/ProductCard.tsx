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

// Safe local fallback by category -- NO external URLs
function getSafeLocalFallback(category: string): string {
  const cat = (category || "").toLowerCase();
  if (cat.includes("mobile") || cat.includes("phone"))
    return "/assets/generated/mobile-smartphone.dim_400x400.jpg";
  if (cat.includes("laptop") || cat.includes("computer"))
    return "/assets/generated/electronics-laptop.dim_400x400.jpg";
  if (cat.includes("tv") || cat.includes("television"))
    return "/assets/generated/electronics-tv.dim_400x400.jpg";
  if (cat.includes("fridge") || cat.includes("refrigerator"))
    return "/assets/generated/appliance-refrigerator.dim_400x400.jpg";
  if (cat.includes("washing"))
    return "/assets/generated/appliance-washing-machine.dim_400x400.jpg";
  if (
    cat.includes("appliance") ||
    cat.includes("kitchen") ||
    cat.includes("microwave")
  )
    return "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg";
  if (
    cat.includes("fashion") ||
    cat.includes("cloth") ||
    cat.includes("men") ||
    cat.includes("women")
  )
    return "/assets/generated/fashion-denim-jeans.dim_400x400.jpg";
  if (
    cat.includes("footwear") ||
    cat.includes("shoe") ||
    cat.includes("sandal")
  )
    return "/assets/generated/footwear-formal-shoes.dim_400x400.jpg";
  if (cat.includes("beauty") || cat.includes("skin") || cat.includes("hair"))
    return "/assets/generated/beauty-care-products.dim_400x400.jpg";
  if (
    cat.includes("grocery") ||
    cat.includes("rice") ||
    cat.includes("dal") ||
    cat.includes("spice") ||
    cat.includes("masala")
  )
    return "/assets/generated/grocery-ghee.dim_400x400.jpg";
  if (
    cat.includes("sport") ||
    cat.includes("fitness") ||
    cat.includes("cricket") ||
    cat.includes("cycle")
  )
    return "/assets/generated/sports-fitness-products.dim_400x400.jpg";
  if (cat.includes("furniture") || cat.includes("sofa") || cat.includes("bed"))
    return "/assets/generated/furniture-sofa.dim_400x400.jpg";
  if (
    cat.includes("smart") ||
    cat.includes("watch") ||
    cat.includes("wearable")
  )
    return "/assets/generated/smart-watch-noise.dim_400x400.jpg";
  if (
    cat.includes("headphone") ||
    cat.includes("speaker") ||
    cat.includes("earphone")
  )
    return "/assets/generated/smart-earbuds-boat.dim_400x400.jpg";
  if (cat.includes("car") || cat.includes("bike") || cat.includes("auto"))
    return "/assets/generated/auto-accessories.dim_400x400.jpg";
  // Ultimate safe fallback
  return "/assets/generated/grocery-ghee.dim_400x400.jpg";
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
              // ONLY use safe local fallback -- never external URLs
              const fallback = getSafeLocalFallback(product.category);
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
