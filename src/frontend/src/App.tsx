import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { StoresProvider } from "@/context/StoresContext";
import { AdminPage } from "@/pages/AdminPage";
import { CartPage } from "@/pages/CartPage";
import { CustomerLoginPage } from "@/pages/CustomerLoginPage";
import { HomePage } from "@/pages/HomePage";
import { MyAccountPage } from "@/pages/MyAccountPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { StoreLocatorPage } from "@/pages/StoreLocatorPage";
import { UpcomingProductsPage } from "@/pages/UpcomingProductsPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>) => {
    const out: { category?: string; q?: string; deals?: string } = {};
    if (search.category) out.category = search.category as string;
    if (search.q) out.q = search.q as string;
    if (search.deals) out.deals = search.deals as string;
    return out;
  },
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$slug",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const storesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stores",
  component: StoreLocatorPage,
  validateSearch: (search: Record<string, unknown>) => {
    const out: { q?: string } = {};
    if (search.q) out.q = search.q as string;
    return out;
  },
});

const upcomingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upcoming",
  component: UpcomingProductsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const customerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer-login",
  component: CustomerLoginPage,
});

const myAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-account",
  component: MyAccountPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  storesRoute,
  upcomingRoute,
  adminRoute,
  customerLoginRoute,
  myAccountRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CustomerProvider>
      <ProductsProvider>
        <StoresProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </CartProvider>
        </StoresProvider>
      </ProductsProvider>
    </CustomerProvider>
  );
}
