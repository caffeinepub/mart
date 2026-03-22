import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { useProducts } from "@/context/ProductsContext";
import { slugify } from "@/data/sampleData";
import { useActor } from "@/hooks/useActor";
import { useMetaTags } from "@/hooks/useMetaTags";
import { getProductImage } from "@/utils/productImages";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  Package,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const USP_ITEMS = [
  { icon: Truck, label: "Free Delivery", sub: "Above ₹499" },
  { icon: Shield, label: "Genuine Product", sub: "100% Authentic" },
  { icon: Package, label: "Easy Returns", sub: "7-day policy" },
];

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
}

function StarRating({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);
  const s = size === "md" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={onChange ? "cursor-pointer" : "cursor-default"}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => {
            onChange?.(0);
            setHovered(0);
          }}
          onClick={() => onChange?.(i)}
          aria-label={`Rate ${i} stars`}
        >
          <Star
            className={`${s} ${
              i <= (hovered || value)
                ? "fill-accent text-accent"
                : "text-muted-foreground"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock > 10)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
        ✅ In Stock
      </span>
    );
  if (stock > 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
        ⚠️ Only {stock} left!
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
      ❌ Out of Stock
    </span>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams({ from: "/products/$slug" });
  const { addItem, items } = useCart();
  const { products } = useProducts();
  const { customer, toggleWishlist, isWishlisted } = useCustomer();
  const { actor } = useActor();
  const navigate = useNavigate();
  const product = products.find((p) => slugify(p.name) === slug);

  useMetaTags({
    title: product?.name,
    description: product?.description
      ? `${product.description.slice(0, 120)} | धर्मा Mart`
      : undefined,
    ogType: "product",
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product) return;
    const loadReviews = async () => {
      try {
        let raw: string | null = null;
        if (actor) {
          try {
            raw = await (actor as any).getReviewsSnapshot();
          } catch {}
        }
        if (!raw) raw = localStorage.getItem("dharma_reviews");
        if (raw) {
          const allReviews = JSON.parse(raw);
          setReviews(allReviews[slug] || []);
        }
      } catch {}
    };
    loadReviews();
  }, [actor, product, slug]);

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
  const wishlisted = isWishlisted(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 4;

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = () => {
    if (!customer) {
      toast.info("Wishlist के लिए login करें");
      navigate({ to: "/customer-login" });
      return;
    }
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

  const handleSubmitReview = async () => {
    if (!customer) {
      toast.info("रिव्यू के लिए पहले login करें");
      navigate({ to: "/customer-login" });
      return;
    }
    if (!newReviewText.trim()) {
      toast.error("कुछ लिखें रिव्यू में");
      return;
    }
    setSubmittingReview(true);
    try {
      const review: Review = {
        id: Date.now().toString(),
        customerName: customer.name,
        rating: newRating,
        text: newReviewText.trim(),
        date: new Date().toISOString(),
      };
      const updated = [...reviews, review];
      setReviews(updated);
      setNewReviewText("");
      setNewRating(5);

      let allReviews: Record<string, Review[]> = {};
      try {
        let raw: string | null = null;
        if (actor) {
          try {
            raw = await (actor as any).getReviewsSnapshot();
          } catch {}
        }
        if (!raw) raw = localStorage.getItem("dharma_reviews");
        if (raw) allReviews = JSON.parse(raw);
      } catch {}
      allReviews[slug] = updated;
      const serialized = JSON.stringify(allReviews);
      if (actor) {
        try {
          await (actor as any).saveReviewsSnapshot(serialized);
        } catch {}
      }
      localStorage.setItem("dharma_reviews", serialized);
      toast.success("रिव्यू दे दिया! धन्यवाद 🙏");
    } finally {
      setSubmittingReview(false);
    }
  };

  const primaryImage = getProductImage(product);
  const encodedName = encodeURIComponent(product.name);
  const fallback2 = `https://picsum.photos/seed/${encodedName}-2/400/400`;
  const fallback3 = `https://picsum.photos/seed/${encodedName}-3/400/400`;
  const extraImages = product.images ?? [];
  const allImages = [primaryImage, ...extraImages];
  if (allImages.length < 2) allImages.push(fallback2);
  if (allImages.length < 3) allImages.push(fallback3);
  const imageList = allImages.filter(
    (img, idx, arr) => arr.indexOf(img) === idx,
  );
  const currentImage = imageList[selectedImageIndex] ?? imageList[0];

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${product.name} - ₹${product.price} | धर्मा Mart`;

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
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center min-h-[320px] border border-border relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover absolute inset-0"
                style={{ minHeight: 320 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/${encodedName}/400/400`;
                }}
              />
            </AnimatePresence>
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-accent text-white border-0 text-sm z-10">
                {product.badge}
              </Badge>
            )}
            {discountPct && (
              <Badge className="absolute top-4 right-4 bg-destructive text-white border-0 text-sm z-10">
                {discountPct}% OFF
              </Badge>
            )}
          </div>

          {imageList.length > 1 && (
            <div className="flex gap-2">
              {imageList.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    selectedImageIndex === idx
                      ? "border-primary ring-2 ring-primary/30 scale-105"
                      : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                  }`}
                  data-ocid={`product.gallery.thumbnail.${idx + 1}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${encodedName}-thumb-${idx}/80/80`;
                    }}
                  />
                </button>
              ))}
            </div>
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

          {/* Rating Summary */}
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} />
            <span className="text-sm font-semibold text-foreground">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              (
              {reviews.length > 0
                ? `${reviews.length} reviews`
                : "No reviews yet"}
              )
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

          {/* Stock Badge */}
          <div>
            <StockBadge stock={product.stock} />
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary hover:opacity-90 text-white h-12 text-base gap-2 disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              data-ocid="product.add_to_cart.primary_button"
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0
                ? "Out of Stock"
                : cartItem
                  ? `Add Again (${cartItem.quantity} in cart)`
                  : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className={`h-12 px-4 border-2 transition-colors ${
                wishlisted
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
              onClick={handleWishlist}
              data-ocid="product.wishlist.toggle"
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-accent" : ""}`} />
            </Button>
          </div>

          <Link to="/cart" className="block">
            <Button
              variant="outline"
              className="w-full h-10 text-base border-primary text-primary hover:bg-primary hover:text-white"
              data-ocid="product.buy_now.secondary_button"
            >
              Buy Now / अभी खरीदें
            </Button>
          </Link>

          {/* Social Share */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium">
              Share:
            </span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-full font-semibold transition-colors"
              data-ocid="product.share.whatsapp.button"
            >
              WA
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-full font-semibold transition-colors"
              data-ocid="product.share.facebook.button"
            >
              FB
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-foreground hover:opacity-80 text-white px-2.5 py-1 rounded-full font-semibold transition-colors"
              data-ocid="product.share.twitter.button"
            >
              X
            </a>
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

      {/* Reviews Section */}
      <div className="mt-10" data-ocid="product.reviews.section">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          ⭐ Reviews / समीक्षा ({reviews.length})
        </h2>

        {/* Write Review */}
        {customer ? (
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <h3 className="font-semibold mb-3">अपनी समीक्षा लिखें</h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <StarRating value={newRating} onChange={setNewRating} size="md" />
            </div>
            <Textarea
              placeholder="आपका experience शेयर करें..."
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              rows={3}
              className="mb-3"
              data-ocid="product.review.textarea"
            />
            <Button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="bg-primary text-white"
              data-ocid="product.review.submit_button"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary/50 border border-border rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Review likhne ke liye{" "}
              <Link
                to="/customer-login"
                className="text-primary font-semibold hover:underline"
              >
                login karein
              </Link>
            </p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="product.reviews.empty_state"
          >
            <p className="text-4xl mb-3">💬</p>
            <p>Abhi koi review nahi hai. Pehle review likhne wale banein!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-xl p-4"
                data-ocid={`product.reviews.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">
                      {review.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                  {review.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}
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
