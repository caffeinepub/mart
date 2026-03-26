import { AdBanner } from "@/components/AdBanner";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/context/ProductsContext";
import { CATEGORIES, SAMPLE_STORES } from "@/data/sampleData";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, MapPin, Store } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const USP_LIST = [
  { emoji: "🚚", title: "Free Delivery", sub: "Orders above ₹499" },
  { emoji: "↩️", title: "Easy Returns", sub: "7-day return policy" },
  { emoji: "🏆", title: "Quality Assured", sub: "Trusted brands only" },
  { emoji: "🏪", title: "50+ Stores", sub: "Pan India presence" },
];

const CATEGORY_ROWS = [
  {
    emoji: "📱",
    title: "Electronics & Mobiles",
    hindiTitle: "इलेक्ट्रॉनिक्स और मोबाइल",
    categoryKeywords: ["mobile", "phone", "electronics", "smartphone"],
    accentColor: "bg-blue-600",
    borderColor: "border-blue-500",
    categoryParam: "mobiles",
  },
  {
    emoji: "💻",
    title: "Laptops & Computers",
    hindiTitle: "लैपटॉप और कंप्यूटर",
    categoryKeywords: ["laptop", "computer", "pc", "desktop"],
    accentColor: "bg-indigo-600",
    borderColor: "border-indigo-500",
    categoryParam: "laptops",
  },
  {
    emoji: "📺",
    title: "TV & Appliances",
    hindiTitle: "टीवी और उपकरण",
    categoryKeywords: [
      "tv",
      "television",
      "appliance",
      "refrigerator",
      "washing",
      "ac",
      "air conditioner",
    ],
    accentColor: "bg-cyan-600",
    borderColor: "border-cyan-500",
    categoryParam: "tv",
  },
  {
    emoji: "👗",
    title: "Fashion – Women",
    hindiTitle: "महिला फैशन",
    categoryKeywords: ["women", "saree", "kurti", "ladies", "girl", "female"],
    accentColor: "bg-pink-500",
    borderColor: "border-pink-500",
    categoryParam: "womens-fashion",
  },
  {
    emoji: "👕",
    title: "Fashion – Men",
    hindiTitle: "पुरुष फैशन",
    categoryKeywords: ["men", "shirt", "trouser", "kurta", "male", "boy"],
    accentColor: "bg-slate-600",
    borderColor: "border-slate-500",
    categoryParam: "mens-fashion",
  },
  {
    emoji: "👟",
    title: "Footwear",
    hindiTitle: "जूते-चप्पल",
    categoryKeywords: ["shoes", "footwear", "sandal", "sneaker", "chappal"],
    accentColor: "bg-amber-600",
    borderColor: "border-amber-500",
    categoryParam: "footwear",
  },
  {
    emoji: "🛒",
    title: "Grocery & Staples",
    hindiTitle: "किराना और अनाज",
    categoryKeywords: [
      "grocery",
      "rice",
      "dal",
      "flour",
      "atta",
      "oil",
      "masala",
      "spice",
      "sugar",
      "tea",
      "coffee",
    ],
    accentColor: "bg-green-600",
    borderColor: "border-green-500",
    categoryParam: "grocery",
  },
  {
    emoji: "💄",
    title: "Beauty & Skincare",
    hindiTitle: "सौंदर्य और त्वचा",
    categoryKeywords: [
      "beauty",
      "skin",
      "face",
      "hair",
      "cosmetic",
      "makeup",
      "shampoo",
      "cream",
    ],
    accentColor: "bg-rose-500",
    borderColor: "border-rose-500",
    categoryParam: "beauty",
  },
  {
    emoji: "🏋️",
    title: "Sports & Fitness",
    hindiTitle: "खेल और फिटनेस",
    categoryKeywords: [
      "sport",
      "fitness",
      "gym",
      "cricket",
      "badminton",
      "cycle",
      "yoga",
    ],
    accentColor: "bg-orange-600",
    borderColor: "border-orange-500",
    categoryParam: "sports",
  },
  {
    emoji: "🛋️",
    title: "Furniture & Home Decor",
    hindiTitle: "फर्नीचर और सजावट",
    categoryKeywords: [
      "furniture",
      "sofa",
      "bed",
      "table",
      "chair",
      "decor",
      "home decor",
    ],
    accentColor: "bg-yellow-600",
    borderColor: "border-yellow-500",
    categoryParam: "furniture",
  },
  {
    emoji: "⌚",
    title: "Smart Gadgets & Wearables",
    hindiTitle: "स्मार्ट गैजेट्स",
    categoryKeywords: [
      "gadget",
      "wearable",
      "smartwatch",
      "watch",
      "earphone",
      "headphone",
      "bluetooth",
      "smart",
    ],
    accentColor: "bg-violet-600",
    borderColor: "border-violet-500",
    categoryParam: "gadgets",
  },
  {
    emoji: "🍳",
    title: "Kitchen Appliances",
    hindiTitle: "रसोई उपकरण",
    categoryKeywords: [
      "kitchen",
      "mixer",
      "cooker",
      "microwave",
      "juicer",
      "grinder",
      "cookware",
    ],
    accentColor: "bg-teal-600",
    borderColor: "border-teal-500",
    categoryParam: "kitchen",
  },
];

type CategoryRowDef = (typeof CATEGORY_ROWS)[number];
type Product = ReturnType<typeof useProducts>["products"][number];

function CategoryRow({
  row,
  products,
  rowIndex,
}: {
  row: CategoryRowDef;
  products: Product[];
  rowIndex: number;
}) {
  const filtered = products.filter((p) =>
    row.categoryKeywords.some((kw) =>
      p.category.toLowerCase().includes(kw.toLowerCase()),
    ),
  );

  if (filtered.length < 3) return null;

  const isAlt = rowIndex % 2 === 1;

  return (
    <section
      className={`py-6 px-4 ${
        isAlt ? "bg-secondary/50" : "bg-card"
      } border-b border-border`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Row Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`border-l-4 ${row.borderColor} pl-3`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{row.emoji}</span>
              <h2 className="text-lg font-bold text-primary uppercase tracking-wide">
                {row.title}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-devanagari mt-0.5">
              {row.hindiTitle}
            </p>
          </div>
          <Link
            to="/products"
            search={{ category: row.categoryParam }}
            className="flex items-center gap-1 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
            data-ocid={`${row.categoryParam}.view_all.link`}
          >
            सभी देखें <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          className="flex gap-3 overflow-x-auto pb-3 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {filtered.map((product, idx) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0 w-44"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
            >
              <ProductCard product={product} index={idx + 1} />
            </motion.div>
          ))}
          {/* View All Card */}
          <Link
            to="/products"
            search={{ category: row.categoryParam }}
            className="flex-shrink-0 w-40 flex flex-col items-center justify-center bg-background border border-dashed border-primary/30 rounded-xl text-center p-4 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div
              className={`w-12 h-12 rounded-full ${row.accentColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              View All
            </span>
            <span className="text-xs text-muted-foreground mt-1 font-devanagari">
              सभी देखें
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  // Scroll position save/restore for back navigation
  useEffect(() => {
    const saved = sessionStorage.getItem("dharma_home_scroll");
    if (saved) {
      const y = Number.parseInt(saved, 10);
      sessionStorage.removeItem("dharma_home_scroll");
      setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 100);
    }
    const handleScroll = () => {
      sessionStorage.setItem("dharma_home_scroll", String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [pinCode, setPinCode] = useState("");
  const navigate = useNavigate();
  const { products } = useProducts();

  const handleFindStore = () => {
    navigate({ to: "/stores", search: { q: pinCode } });
  };

  return (
    <div>
      {/* Diwali Banner */}
      <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-semibold tracking-wide">
        🪔 DIWALI SPECIAL: Up to 50% OFF! | Use code{" "}
        <span className="font-bold bg-black/10 px-2 rounded">DIWALI50</span> |
        Limited time offer!
      </div>

      {/* Ad Banner — Slot 1: below Diwali strip, above Hero */}
      <AdBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden" data-ocid="hero.section">
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[420px]">
          {/* Left Hero */}
          <div className="lg:col-span-2 relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/assets/generated/hero-dharma-mart.dim_1200x500.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full min-h-[320px]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">
                  भारत का अपना Mart
                </p>
                <h1 className="text-white font-bold text-2xl md:text-4xl leading-tight mb-3 font-devanagari">
                  भारत का अपना Mart –<br />
                  <span className="text-accent">अब घर बैठे</span> खरीदारी करें
                </h1>
                <p className="text-white/80 text-sm md:text-base mb-6 max-w-md">
                  Groceries, Fashion, Electronics & more — Delivered to your
                  door or pick up from our 50+ stores.
                </p>
                <Link to="/products">
                  <Button
                    className="bg-accent hover:opacity-90 text-accent-foreground font-bold px-8 py-3 text-base shadow-lg"
                    data-ocid="hero.shop_now.primary_button"
                  >
                    SHOP ONLINE NOW <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Promo Card */}
          <div className="bg-secondary p-6 flex flex-col justify-center gap-4 border-l border-border">
            <div className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded text-center uppercase tracking-wider">
              🪔 Diwali Special: Up to 50% OFF!
            </div>
            <div className="bg-card rounded-lg p-5 border border-border shadow-sm">
              <h3 className="font-bold text-primary text-lg uppercase tracking-wide mb-1">
                Find a Store
              </h3>
              <p className="text-muted-foreground text-sm mb-4">Near You</p>
              <div className="text-4xl text-center mb-4">🗺️</div>
              <div className="flex gap-0">
                <Input
                  placeholder="Enter PIN Code / City"
                  className="rounded-r-none text-sm h-9"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFindStore()}
                  data-ocid="hero.store_finder.input"
                />
                <Button
                  onClick={handleFindStore}
                  className="rounded-l-none bg-primary hover:opacity-90 text-white h-9 px-3 text-xs"
                  data-ocid="hero.store_finder.button"
                >
                  FIND
                </Button>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/stores"
                className="text-primary text-sm font-semibold hover:text-accent transition-colors flex items-center justify-center gap-1"
              >
                <MapPin className="h-4 w-4" /> View all 50+ Stores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories — scrollable pills */}
      <section
        className="max-w-7xl mx-auto px-4 py-6"
        data-ocid="categories.section"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wide">
            सभी श्रेणियाँ
          </h2>
          <Link
            to="/products"
            className="text-primary text-sm font-semibold hover:text-accent transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex-shrink-0"
            >
              <Link
                to="/products"
                search={{ category: cat.id }}
                className="flex flex-col items-center gap-2 bg-card rounded-xl p-3 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group min-w-[80px] w-[90px]"
                data-ocid={`categories.item.${idx + 1}`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="text-[10px] font-semibold text-primary text-center uppercase leading-tight">
                  {cat.label}
                </span>
                <span className="text-[9px] text-muted-foreground font-devanagari text-center leading-tight">
                  {cat.labelHindi}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category-wise Horizontal Product Rows (Flipkart style) */}
      <div data-ocid="category_rows.section">
        {CATEGORY_ROWS.map((row, idx) => (
          <CategoryRow
            key={row.categoryParam}
            row={row}
            products={products}
            rowIndex={idx}
          />
        ))}
      </div>

      {/* Ad Banner — Slot 2: after product rows, before Stores */}
      <AdBanner />

      {/* Visit Our Stores */}
      <section
        className="max-w-7xl mx-auto px-4 py-10"
        data-ocid="stores.section"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-border shadow-md">
          {/* Map Visual */}
          <div className="bg-secondary relative p-8 flex flex-col justify-center items-center min-h-[280px]">
            <div className="text-6xl mb-4">🗺️</div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
              {SAMPLE_STORES.slice(0, 4).map((store) => (
                <div
                  key={store.id}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <MapPin className="h-3 w-3 text-accent flex-shrink-0" />
                  <span className="text-primary font-semibold">
                    {store.city}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-4 text-center">
              & 40+ more locations across India
            </p>
          </div>
          {/* CTA Panel */}
          <div className="bg-primary text-white p-8 flex flex-col justify-center">
            <Store className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-2 font-devanagari">
              Experience धर्मा Mart
            </h3>
            <p className="text-white/80 text-sm mb-2">
              offline in{" "}
              <span className="text-accent font-bold text-lg">50+</span>{" "}
              locations!
            </p>
            <p className="text-white/70 text-sm mb-6">
              Visit your nearest store for an immersive shopping experience.
              Touch, feel and try before you buy.
            </p>
            <Link to="/stores">
              <Button
                className="bg-accent hover:opacity-90 text-accent-foreground font-bold px-6"
                data-ocid="stores.find_store.primary_button"
              >
                <MapPin className="mr-2 h-4 w-4" /> FIND A STORE NEAR YOU
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* USP Strip */}
      <section className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {USP_LIST.map((usp) => (
              <div key={usp.title} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{usp.emoji}</span>
                <span className="font-bold text-sm">{usp.title}</span>
                <span className="text-white/60 text-xs">{usp.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
