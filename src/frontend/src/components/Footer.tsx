import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed! You'll receive exclusive deals and offers.");
    setEmail("");
  };

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪔</span>
              <span className="font-devanagari text-xl font-bold">
                धर्मा Mart
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              भारत का अपना Mart — bringing quality products from trusted brands
              to your doorstep and our 50+ stores nationwide.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
                aria-label="X"
              >
                <SiX className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <SiYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-accent">
              Shop
            </h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link
                  to="/products"
                  search={{ category: "grocery" }}
                  className="hover:text-white transition-colors"
                >
                  Grocery
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "fashion" }}
                  className="hover:text-white transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "electronics" }}
                  className="hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "home" }}
                  className="hover:text-white transition-colors"
                >
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "personal" }}
                  className="hover:text-white transition-colors"
                >
                  Personal Care
                </Link>
              </li>
              <li>
                <Link
                  to="/upcoming"
                  className="hover:text-accent transition-colors font-semibold text-accent/80"
                  data-ocid="footer.upcoming.link"
                >
                  🔜 Upcoming Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-accent">
              Help
            </h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link
                  to="/stores"
                  className="hover:text-white transition-colors"
                >
                  Store Locator
                </Link>
              </li>
              <li>
                <a
                  href="https://dharmamart.in/track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="https://dharmamart.in/returns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Return Policy
                </a>
              </li>
              <li>
                <a
                  href="https://dharmamart.in/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-white transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-panel"
                  className="hover:text-white transition-colors text-accent font-medium"
                >
                  🛡️ Admin Panel (New)
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-accent">
              Newsletter
            </h4>
            <p className="text-white/70 text-sm mb-3">
              Get exclusive deals, festival offers & new arrivals direct to your
              inbox!
            </p>
            <div className="flex gap-0">
              <Input
                type="email"
                placeholder="your@email.com"
                className="rounded-r-none border-0 bg-white/10 text-white placeholder:text-white/40 h-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="footer.newsletter.input"
              />
              <Button
                onClick={handleSubscribe}
                className="rounded-l-none bg-accent hover:opacity-90 text-white h-9 px-3 border-0"
                data-ocid="footer.newsletter.submit_button"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <span>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              className="hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </span>
          <span>धर्मा Mart — भारत का अपना Mart</span>
        </div>
      </div>
    </footer>
  );
}
