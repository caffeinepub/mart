import { ChatbotWidget } from "@/components/ChatbotWidget";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { Link, useRouterState } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { Footer } from "./Footer";
import { Header } from "./Header";

function MobileBottomNav() {
  const { totalItems } = useCart();
  const { customer } = useCustomer();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/products", icon: Search, label: "Search" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: totalItems },
    {
      to: customer ? "/my-account" : "/customer-login",
      icon: User,
      label: "Account",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-primary border-t border-primary/50 safe-area-pb"
      data-ocid="mobile.bottom.nav"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.to ||
            (item.to !== "/" && currentPath.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
                isActive ? "text-accent" : "text-white/70 hover:text-white"
              }`}
              data-ocid={`mobile.nav.${item.label.toLowerCase()}.link`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <ChatbotWidget />
    </div>
  );
}
