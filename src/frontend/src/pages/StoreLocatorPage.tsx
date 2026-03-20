import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_STORES } from "@/data/sampleData";
import { useAllStores } from "@/hooks/useQueries";
import { useSearch } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export function StoreLocatorPage() {
  const search = useSearch({ from: "/stores" }) as { q?: string };
  const [query, setQuery] = useState(search.q || "");
  const [activeQuery, setActiveQuery] = useState(search.q || "");

  const { data: backendStores } = useAllStores();

  const allStores = useMemo(() => {
    if (backendStores && backendStores.length > 0) {
      return backendStores.map((s, i) => ({
        id: i + 100,
        city: s.city,
        address: s.address,
        phone: s.phone,
        pincode: s.pincode,
        timings: "9:00 AM – 9:00 PM",
      }));
    }
    return SAMPLE_STORES;
  }, [backendStores]);

  const filtered = useMemo(() => {
    if (!activeQuery) return allStores;
    const q = activeQuery.toLowerCase();
    return allStores.filter(
      (s) =>
        s.city.toLowerCase().includes(q) ||
        s.pincode.includes(q) ||
        s.address.toLowerCase().includes(q),
    );
  }, [allStores, activeQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="stores.page">
      <div className="text-center mb-8">
        <h1 className="section-title">Store Locator</h1>
        <p className="text-muted-foreground mt-2 font-devanagari">
          अपने नज़दीकी धर्मा Mart स्टोर को खोजें
        </p>
        <p className="text-sm text-muted-foreground">
          {allStores.length} stores across India
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-0 max-w-lg mx-auto mb-8">
        <Input
          placeholder="Enter City, PIN Code or Area..."
          className="rounded-r-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setActiveQuery(query)}
          data-ocid="stores.search_input"
        />
        <Button
          onClick={() => setActiveQuery(query)}
          className="rounded-l-none bg-primary hover:opacity-90 text-white"
          data-ocid="stores.search.button"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12" data-ocid="stores.empty_state">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="font-bold text-primary">
            No stores found in "{activeQuery}"
          </h3>
          <p className="text-muted-foreground mt-2">
            Try searching for another city or pincode.
          </p>
          <Button
            className="mt-4 bg-primary text-white"
            onClick={() => {
              setQuery("");
              setActiveQuery("");
            }}
          >
            Show All Stores
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((store, idx) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`stores.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary text-base">
                    {store.city}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {store.address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PIN: {store.pincode}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-foreground">
                      <Phone className="h-3 w-3 text-primary" /> {store.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-accent" />
                    <span className="text-xs text-muted-foreground">
                      {store.timings}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-3 text-xs border-primary text-primary hover:bg-primary hover:text-white"
                data-ocid="stores.directions.button"
              >
                <MapPin className="h-3.5 w-3.5 mr-1" /> Get Directions
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
