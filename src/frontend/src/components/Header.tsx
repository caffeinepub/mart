import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "grocery", label: "GROCERY" },
  { id: "fashion", label: "FASHION" },
  { id: "electronics", label: "ELECTRONICS" },
  { id: "home", label: "HOME & KITCHEN" },
  { id: "personal", label: "PERSONAL CARE" },
  { id: "snacks", label: "BEST SELLERS" },
];

export function Header() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate({ to: "/products", search: { q: searchQuery.trim() } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Utility Bar */}
      <div className="bg-foreground text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>
            🚚 FREE Delivery on orders above ₹499 | India's Trusted Retail Chain
          </span>
          <div className="hidden sm:flex items-center gap-4">
            <span>📞 1800-DHARMA-1</span>
            <Link
              to="/stores"
              className="hover:text-accent transition-colors"
              data-ocid="utility.stores.link"
            >
              Store Locator
            </Link>
            <Link
              to="/cart"
              className="hover:text-accent transition-colors"
              data-ocid="utility.cart.link"
            >
              Wishlist
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Header */}
      <div className="bg-primary text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            data-ocid="nav.logo.link"
          >
            <span className="text-2xl">🪔</span>
            <div>
              <div className="font-devanagari text-xl font-bold leading-tight text-white">
                धर्मा Mart
              </div>
              <div className="text-[10px] text-white/60 uppercase tracking-widest">
                भारत का अपना Mart
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 flex gap-0 max-w-2xl mx-auto">
            <Input
              placeholder="चावल, कुर्ता, मोबाइल... खोजें"
              className="rounded-r-none border-0 bg-white text-foreground placeholder:text-muted-foreground h-10 flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              data-ocid="header.search_input"
            />
            <Button
              onClick={handleSearch}
              className="rounded-l-none bg-accent hover:opacity-90 text-white border-0 h-10 px-4"
              data-ocid="header.search.button"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/stores"
              className="hidden md:flex flex-col items-center text-white/80 hover:text-white transition-colors text-xs"
              data-ocid="nav.stores.link"
            >
              <MapPin className="h-5 w-5" />
              <span>Stores</span>
            </Link>
            <Link
              to="/cart"
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors text-xs relative"
              data-ocid="nav.cart.link"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] bg-accent text-white border-0 flex items-center justify-center rounded-full">
                    {totalItems}
                  </Badge>
                )}
              </div>
              <span>Cart</span>
            </Link>
            <button
              type="button"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.mobile_menu.toggle"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="bg-white border-b border-border shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to="/products"
                search={{ category: cat.id }}
                className="px-4 py-3 text-xs font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors uppercase tracking-wider border-r border-border last:border-r-0"
                data-ocid="nav.category.tab"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              search={{ category: cat.id }}
              className="block px-4 py-3 text-sm font-semibold text-primary border-b border-border uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            to="/stores"
            className="block px-4 py-3 text-sm font-semibold text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Store Locator
          </Link>
        </div>
      )}
    </header>
  );
}
