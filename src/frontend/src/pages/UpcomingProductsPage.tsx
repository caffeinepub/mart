import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/context/ProductsContext";
import { Bell, Clock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

function CountdownBadge() {
  return (
    <div className="flex items-center gap-2 text-accent text-sm font-semibold">
      <Clock className="h-4 w-4 animate-pulse" />
      <span>जल्द आ रहा है</span>
    </div>
  );
}

export function UpcomingProductsPage() {
  const { products } = useProducts();
  const upcomingProducts = products.filter((p) => p.isUpcoming);

  const handleNotify = (name: string) => {
    toast.success(`"${name}" के लिए आपको सूचित किया जाएगा! 🔔`);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="h-8 w-8 text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold font-devanagari">
                आने वाले Products
              </h1>
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <p className="text-white/70 text-lg mt-2">
              Upcoming Products — Be the first to know!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {upcomingProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="upcoming.empty_state"
          >
            <div className="text-7xl mb-6">🎁</div>
            <h2 className="text-2xl font-bold text-foreground mb-3 font-devanagari">
              जल्द आ रहा है!
            </h2>
            <p className="text-muted-foreground max-w-md text-base leading-relaxed">
              हम कुछ खास products लाने वाले हैं। Admin panel में products को "Upcoming"
              mark करें और वे यहाँ दिखेंगे।
            </p>
            <div className="mt-6 flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-6 py-3">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-accent font-semibold">Stay Tuned!</span>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-8 bg-accent rounded-full" />
              <h2 className="text-xl font-bold text-foreground">
                {upcomingProducts.length} Upcoming{" "}
                {upcomingProducts.length === 1 ? "Product" : "Products"}
              </h2>
            </div>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="upcoming.list"
            >
              {upcomingProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  data-ocid={`upcoming.item.${idx + 1}`}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover filter blur-[2px] scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {product.emoji}
                      </div>
                    )}
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                      <Badge className="bg-accent text-white border-0 text-xs font-bold px-3 py-1 shadow-lg">
                        🔜 COMING SOON
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <CountdownBadge />
                    <h3 className="font-semibold text-foreground text-sm mt-1 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.nameHindi &&
                      product.nameHindi !== product.name && (
                        <p className="text-xs text-muted-foreground font-devanagari">
                          {product.nameHindi}
                        </p>
                      )}
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {product.category}
                    </p>
                    <div className="mt-2 mb-3">
                      {product.price > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-primary">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (Launching Soon)
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">
                          Price TBA
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-accent hover:opacity-90 text-white text-xs gap-1.5 h-8"
                      onClick={() => handleNotify(product.name)}
                      data-ocid={`upcoming.notify.button.${idx + 1}`}
                    >
                      <Bell className="h-3 w-3" />
                      Notify Me
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
