import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, SAMPLE_PRODUCTS } from "@/data/sampleData";
import { useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export function ProductsPage() {
  const search = useSearch({ from: "/products" }) as {
    category?: string;
    q?: string;
    deals?: string;
  };
  const [localSearch, setLocalSearch] = useState(search.q || "");
  const [activeSearch, setActiveSearch] = useState(search.q || "");
  const [activeCategory, setActiveCategory] = useState(
    search.category || "all",
  );
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let products = SAMPLE_PRODUCTS;

    if (search.deals === "true") {
      products = products.filter((p) => p.isDeal);
    }

    if (activeCategory && activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }

    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameHindi.includes(q) ||
          p.category.includes(q),
      );
    }

    if (sortBy === "price-asc")
      products = [...products].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      products = [...products].sort((a, b) => b.price - a.price);
    if (sortBy === "discount") {
      products = [...products].sort((a, b) => {
        const da = a.originalPrice
          ? (a.originalPrice - a.price) / a.originalPrice
          : 0;
        const db = b.originalPrice
          ? (b.originalPrice - b.price) / b.originalPrice
          : 0;
        return db - da;
      });
    }

    return products;
  }, [activeCategory, activeSearch, sortBy, search.deals]);

  const handleSearch = () => setActiveSearch(localSearch);

  const allCategories = [
    { id: "all", label: "ALL", emoji: "🛒" },
    ...CATEGORIES,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="products.page">
      <h1 className="section-title mb-6">All Products | सभी उत्पाद</h1>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-0 flex-1">
          <Input
            placeholder="Search products... उत्पाद खोजें"
            className="rounded-r-none"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            data-ocid="products.search_input"
          />
          <Button
            onClick={handleSearch}
            className="rounded-l-none bg-primary hover:opacity-90 text-white"
            data-ocid="products.search.button"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            className="text-sm border border-border rounded px-3 py-2 bg-card text-foreground"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            data-ocid="products.sort.select"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {allCategories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors uppercase ${
              activeCategory === cat.id
                ? "bg-primary text-white border-primary"
                : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
            }`}
            data-ocid="products.category.tab"
          >
            {(cat as { emoji?: string }).emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="products.empty_state">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-primary mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            Try a different search or category.
          </p>
          <Button
            className="mt-4 bg-primary text-white"
            onClick={() => {
              setActiveCategory("all");
              setActiveSearch("");
              setLocalSearch("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <ProductCard product={product} index={idx + 1} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
