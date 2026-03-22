import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/context/ProductsContext";
import { CATEGORIES } from "@/data/sampleData";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export function ProductsPage() {
  const { products } = useProducts();
  const navigate = useNavigate();
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

  useEffect(() => {
    setActiveCategory(search.category || "all");
    setActiveSearch(search.q || "");
    setLocalSearch(search.q || "");
    if (search.deals === "true") {
      setActiveCategory("all");
    }
  }, [search.category, search.q, search.deals]);

  const filtered = useMemo(() => {
    let list = products;

    if (search.deals === "true") {
      list = list.filter((p) => p.isDeal);
    }

    if (activeCategory && activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameHindi?.includes(q) ||
          p.category.includes(q),
      );
    }

    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "discount") {
      list = [...list].sort((a, b) => {
        const da = a.originalPrice
          ? (a.originalPrice - a.price) / a.originalPrice
          : 0;
        const db = b.originalPrice
          ? (b.originalPrice - b.price) / b.originalPrice
          : 0;
        return db - da;
      });
    }

    return list;
  }, [products, activeCategory, activeSearch, sortBy, search.deals]);

  const handleSearch = () => setActiveSearch(localSearch);

  const handleCategoryClick = (catId: string) => {
    if (catId === "all") {
      navigate({ to: "/products" });
    } else {
      navigate({ to: "/products", search: { category: catId } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="products.page">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/">
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Home / होम
          </button>
        </Link>
      </div>
      <h1 className="section-title mb-6">All Products | सभी उत्पाद</h1>

      {search.deals === "true" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-3 mb-6 flex items-center gap-3"
          data-ocid="products.deals.panel"
        >
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-bold text-destructive text-base">
              Today's Deals — Limited Time Offers
            </p>
            <p className="text-xs text-muted-foreground">
              Grab the best deals before they're gone!
            </p>
          </div>
        </motion.div>
      )}

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

      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 flex-nowrap">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors uppercase ${
              activeCategory === cat.id
                ? "bg-primary text-white border-primary"
                : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
            }`}
            data-ocid="products.category.tab"
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

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
              navigate({ to: "/products" });
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
