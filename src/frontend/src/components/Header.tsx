import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { useProducts } from "@/context/ProductsContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  { id: "grocery", label: "GROCERY" },
  { id: "fashion", label: "FASHION" },
  { id: "electronics", label: "ELECTRONICS" },
  { id: "home", label: "HOME & KITCHEN" },
  { id: "personal", label: "PERSONAL CARE" },
  { id: "snacks", label: "BEST SELLERS" },
];

const UPCOMING_LINK = { to: "/upcoming" as const, label: "🔜 UPCOMING" };

export function Header() {
  const { totalItems } = useCart();
  const { customer } = useCustomer();
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lower = val.toLowerCase();
    const matched = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) || p.nameHindi?.includes(val),
      )
      .slice(0, 6)
      .map((p) => p.name);
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
  };

  const handleSearch = (q?: string) => {
    const term = q || searchQuery;
    if (term.trim()) {
      navigate({ to: "/products", search: { q: term.trim() } });
      setShowSuggestions(false);
      setSearchQuery(term);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowSuggestions(false);
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
              to="/contact"
              className="hover:text-accent transition-colors"
              data-ocid="utility.contact.link"
            >
              Contact
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

          {/* Search Bar with Suggestions */}
          <div
            className="flex-1 flex gap-0 max-w-2xl mx-auto relative"
            ref={searchRef}
          >
            <Input
              placeholder="चावल, कुर्ता, मोबाइल... खोजें"
              className="rounded-r-none border-0 bg-white text-foreground placeholder:text-muted-foreground h-10 flex-1"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              data-ocid="header.search_input"
            />
            <Button
              onClick={() => handleSearch()}
              className="rounded-l-none bg-accent hover:opacity-90 text-white border-0 h-10 px-4"
              data-ocid="header.search.button"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 flex items-center gap-2 border-b border-gray-100 last:border-0"
                    onClick={() => handleSearch(s)}
                    data-ocid={`header.suggestion.item.${idx + 1}`}
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/stores"
              className="hidden md:flex flex-col items-center text-white/80 hover:text-white transition-colors"
              data-ocid="nav.stores.link"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-[10px]">Stores</span>
            </Link>
            <Link
              to={customer ? "/my-account" : "/customer-login"}
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
              data-ocid="nav.account.link"
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] hidden sm:block">
                {customer ? customer.name.split(" ")[0] : "Login"}
              </span>
            </Link>
            <Link
              to="/cart"
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors relative"
              data-ocid="nav.cart.link"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 p-0 flex items-center justify-center rounded-full border-0">
                    {totalItems > 9 ? "9+" : totalItems}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] hidden sm:block">Cart</span>
            </Link>
            <button
              type="button"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Toggle menu"
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
      <div className="bg-primary/90 border-t border-white/10 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              search={{ category: cat.id }}
              className="flex-shrink-0 text-white/80 hover:text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-white/10 transition-colors uppercase tracking-wide"
              data-ocid={`nav.category.${cat.id}.link`}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            to={UPCOMING_LINK.to}
            className="flex-shrink-0 text-accent font-semibold text-xs px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
            data-ocid="nav.upcoming.link"
          >
            {UPCOMING_LINK.label}
          </Link>
          <Link
            to="/contact"
            className="flex-shrink-0 text-white/80 hover:text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-white/10 transition-colors ml-auto"
            data-ocid="nav.contact.link"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/95 border-t border-white/10 px-4 py-3 space-y-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              search={{ category: cat.id }}
              className="block text-white/80 hover:text-white text-sm py-1.5 font-medium"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid={`nav.mobile.${cat.id}.link`}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="block text-white/80 hover:text-white text-sm py-1.5 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
