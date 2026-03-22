import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { CouponProvider } from "@/context/CouponContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { StoresProvider } from "@/context/StoresContext";
import { AdminPage } from "@/pages/AdminPage";
import { AdminPanelPage } from "@/pages/AdminPanelPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ContactPage } from "@/pages/ContactPage";
import { CustomerLoginPage } from "@/pages/CustomerLoginPage";
import { HomePage } from "@/pages/HomePage";
import { MyAccountPage } from "@/pages/MyAccountPage";
import { OrderTrackingPage } from "@/pages/OrderTrackingPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { StoreDashboardPage } from "@/pages/StoreDashboardPage";
import { StoreLocatorPage } from "@/pages/StoreLocatorPage";
import { StoreLoginPage } from "@/pages/StoreLoginPage";
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

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-tracking",
  component: OrderTrackingPage,
  validateSearch: (search: Record<string, unknown>) => {
    const out: { success?: string; orderId?: string } = {};
    if (search.success) out.success = search.success as string;
    if (search.orderId) out.orderId = search.orderId as string;
    return out;
  },
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

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-panel",
  component: AdminPanelPage,
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

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const storeLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store-login",
  component: StoreLoginPage,
});

const storeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store-dashboard",
  component: StoreDashboardPage,
  validateSearch: (search: Record<string, unknown>) => {
    const out: { storeId?: string } = {};
    if (search.storeId) out.storeId = search.storeId as string;
    return out;
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderTrackingRoute,
  storesRoute,
  upcomingRoute,
  adminRoute,
  adminPanelRoute,
  customerLoginRoute,
  myAccountRoute,
  contactRoute,
  storeLoginRoute,
  storeDashboardRoute,
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
            <CouponProvider>
              <RouterProvider router={router} />
              <Toaster richColors position="top-right" />
            </CouponProvider>
          </CartProvider>
        </StoresProvider>
      </ProductsProvider>
    </CustomerProvider>
  );
}
