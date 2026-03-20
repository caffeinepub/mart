import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { type SampleProduct, slugify } from "@/data/sampleData";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: SampleProduct;
  index?: number;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const discountPct = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

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
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-7xl group-hover:scale-110 transition-transform duration-200">
              {product.emoji}
            </span>
          )}
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
          <Button
            className="mt-2 w-full bg-primary hover:opacity-90 text-white text-xs h-8 gap-1.5"
            onClick={handleAddToCart}
            data-ocid={`product.add_to_cart.${index}`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
