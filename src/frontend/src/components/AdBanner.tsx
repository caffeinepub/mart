import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_ADS = [
  {
    id: 1,
    title: "धर्मा Mart Sale!",
    subtitle: "Up to 60% OFF on Electronics — Mobiles, Laptops & TVs",
    badge: "⚡ MEGA SALE",
    cta: "Shop Electronics →",
    link: "/products?category=electronics",
    bgImage: "/assets/generated/ad-banner-electronics.dim_1200x400.jpg",
    overlayColor: "rgba(30, 58, 138, 0.72)",
  },
  {
    id: 2,
    title: "Fashion Week!",
    subtitle: "Women's & Men's Clothing, Footwear & Accessories from ₹299",
    badge: "🔥 TRENDING",
    cta: "Shop Fashion →",
    link: "/products?category=womens-fashion",
    bgImage: "/assets/generated/ad-banner-fashion.dim_1200x400.jpg",
    overlayColor: "rgba(157, 23, 77, 0.70)",
  },
  {
    id: 3,
    title: "FREE Delivery!",
    subtitle: "On all orders above ₹499 — Shop from 700+ products",
    badge: "✅ FREE SHIPPING",
    cta: "Shop Now →",
    link: "/products",
    bgImage: "/assets/generated/ad-banner-grocery.dim_1200x400.jpg",
    overlayColor: "rgba(20, 83, 45, 0.70)",
  },
  {
    id: 4,
    title: "🪔 Diwali Special!",
    subtitle:
      "Groceries, Home Decor & More — Festive Offers Across All Categories",
    badge: "🎉 FESTIVE DEALS",
    cta: "Explore Offers →",
    link: "/products",
    bgImage: "/assets/generated/ad-banner-diwali.dim_1200x400.jpg",
    overlayColor: "rgba(120, 53, 15, 0.70)",
  },
];

const ADS_STORAGE_KEY = "dharma_mart_ads";

function loadAds() {
  try {
    const stored = localStorage.getItem(ADS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as typeof DEFAULT_ADS;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_ADS;
}

export const DEFAULT_ADS_EXPORT = DEFAULT_ADS;
export { ADS_STORAGE_KEY };

export function AdBanner() {
  const [ads, setAds] = useState(loadAds);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Listen for admin updates
  useEffect(() => {
    const handler = () => setAds(loadAds());
    window.addEventListener("dharma_ads_updated", handler);
    return () => window.removeEventListener("dharma_ads_updated", handler);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((index + ads.length) % ads.length);
        setIsTransitioning(false);
      }, 200);
    },
    [isTransitioning, ads.length],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  if (!ads.length) return null;
  const ad = ads[current % ads.length];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: 160 }}
      data-ocid="ad_banner.section"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url('${ad.bgImage}')`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: ad.overlayColor,
          opacity: isTransitioning ? 0 : 1,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 w-full flex items-center justify-between px-6 md:px-16 py-6 md:py-8 transition-all duration-300"
        style={{ minHeight: 160, opacity: isTransitioning ? 0 : 1 }}
      >
        <div className="flex-1 min-w-0 pr-6">
          <span className="inline-block text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest bg-white/20 text-white border border-white/30">
            {ad.badge}
          </span>
          <h2 className="text-white font-bold text-xl md:text-3xl leading-tight mb-2 font-devanagari drop-shadow">
            {ad.title}
          </h2>
          <p className="text-white/90 text-sm md:text-base drop-shadow font-devanagari">
            {ad.subtitle}
          </p>
        </div>
        <div className="flex-shrink-0">
          <a
            href={ad.link}
            className="inline-block font-bold text-sm md:text-base px-6 py-3 rounded-full shadow-xl bg-white text-gray-900 hover:bg-accent hover:text-white transition-all whitespace-nowrap"
            data-ocid="ad_banner.cta.button"
          >
            {ad.cta}
          </a>
        </div>
      </div>

      {/* Prev/Next */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white z-20"
        aria-label="Previous"
        data-ocid="ad_banner.prev.button"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white z-20"
        aria-label="Next"
        data-ocid="ad_banner.next.button"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {ads.map((a, i) => (
          <button
            key={a.id}
            type="button"
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
            }}
            aria-label={`Ad ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
