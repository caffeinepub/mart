import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, SAMPLE_PRODUCTS, SAMPLE_STORES } from "@/data/sampleData";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles, Store, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const USP_LIST = [
  { emoji: "🚚", title: "Free Delivery", sub: "Orders above ₹499" },
  { emoji: "↩️", title: "Easy Returns", sub: "7-day return policy" },
  { emoji: "🏆", title: "Quality Assured", sub: "Trusted brands only" },
  { emoji: "🏪", title: "50+ Stores", sub: "Pan India presence" },
];

export function HomePage() {
  const [pinCode, setPinCode] = useState("");
  const navigate = useNavigate();

  const featuredProducts = SAMPLE_PRODUCTS.filter((p) => p.isFeatured);
  const dealProducts = SAMPLE_PRODUCTS.filter((p) => p.isDeal && !p.isFeatured);
  const dealsToShow =
    dealProducts.length > 0
      ? dealProducts
      : SAMPLE_PRODUCTS.filter((p) => p.isDeal);

  const handleFindStore = () => {
    navigate({ to: "/stores", search: { q: pinCode } });
  };

  return (
    <div>
      {/* Diwali Banner */}
      <div className="bg-accent text-white text-center py-2 text-sm font-semibold tracking-wide">
        🪔 DIWALI SPECIAL: Up to 50% OFF! | Use code{" "}
        <span className="font-bold bg-white/20 px-2 rounded">DIWALI50</span> |
        Limited time offer!
      </div>

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
                    className="bg-accent hover:opacity-90 text-white font-bold px-8 py-3 text-base shadow-lg"
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
            <div className="bg-accent text-white text-xs font-bold py-1.5 px-3 rounded text-center uppercase tracking-wider">
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

      {/* Product Categories — scrollable row */}
      <section
        className="max-w-7xl mx-auto px-4 py-10"
        data-ocid="categories.section"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Product Categories</h2>
          <Link
            to="/products"
            className="text-primary text-sm font-semibold hover:text-accent transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
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

      {/* Featured Products */}
      <section
        className="bg-card border-y border-border py-10"
        data-ocid="featured.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link
              to="/products"
              className="text-primary text-sm font-semibold hover:text-accent transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} index={idx + 1} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                className="bg-accent hover:opacity-90 text-white font-bold px-6"
                data-ocid="stores.find_store.primary_button"
              >
                <MapPin className="mr-2 h-4 w-4" /> FIND A STORE NEAR YOU
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section
        className="bg-card border-t border-border py-10"
        data-ocid="deals.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-destructive" />
              <h2 className="section-title">Today's Deals</h2>
              <span className="text-xs bg-destructive text-white px-2 py-0.5 rounded font-bold">
                LIMITED TIME
              </span>
            </div>
            <Link
              to="/products"
              search={{ deals: "true" }}
              className="text-primary text-sm font-semibold hover:text-accent transition-colors flex items-center gap-1"
              data-ocid="deals.all_deals.link"
            >
              All Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {dealsToShow.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} index={idx + 1} />
              </motion.div>
            ))}
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
