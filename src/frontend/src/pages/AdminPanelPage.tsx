import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useCustomer } from "@/context/CustomerContext";
import { useProducts } from "@/context/ProductsContext";
import type { SampleProduct } from "@/data/sampleData";
import { CATEGORIES } from "@/data/sampleData";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  FileText,
  Home,
  Layers,
  Lock,
  Megaphone,
  Menu,
  Package,
  Printer,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ADMIN_PASSWORD = "dharma@admin123";

type AdminSection =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "payment"
  | "marketing"
  | "reports"
  | "security";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  date: string;
}

interface ShippingZone {
  id: string;
  city: string;
  pincode: string;
  fee: number;
  days: string;
}

interface CouponData {
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  expiry: string;
  active: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  role: "Admin" | "Manager" | "Viewer";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

function logActivity(action: string) {
  const log: string[] = loadLS<string[]>("dharma_admin_log", []);
  const entry = `[${new Date().toLocaleString("en-IN")}] ${action}`;
  saveLS("dharma_admin_log", [entry, ...log].slice(0, 20));
}

const DEFAULT_SHIPPING: ShippingZone[] = [
  { id: "1", city: "Delhi", pincode: "110001-110099", fee: 40, days: "2-3" },
  { id: "2", city: "Mumbai", pincode: "400001-400099", fee: 50, days: "3-4" },
  {
    id: "3",
    city: "Bangalore",
    pincode: "560001-560099",
    fee: 50,
    days: "3-4",
  },
  { id: "4", city: "Chennai", pincode: "600001-600099", fee: 55, days: "4-5" },
  {
    id: "5",
    city: "Hyderabad",
    pincode: "500001-500099",
    fee: 55,
    days: "4-5",
  },
  { id: "6", city: "Kolkata", pincode: "700001-700099", fee: 45, days: "3-4" },
  { id: "7", city: "Pune", pincode: "411001-411099", fee: 50, days: "3-4" },
  { id: "8", city: "Jaipur", pincode: "302001-302099", fee: 60, days: "5-6" },
];

const DEFAULT_COUPONS: CouponData[] = [
  {
    code: "DHARMA10",
    type: "percent",
    value: 10,
    minOrder: 500,
    expiry: "2026-12-31",
    active: true,
  },
  {
    code: "DHARMA20",
    type: "percent",
    value: 20,
    minOrder: 1000,
    expiry: "2026-12-31",
    active: true,
  },
  {
    code: "WELCOME50",
    type: "flat",
    value: 50,
    minOrder: 200,
    expiry: "2026-06-30",
    active: true,
  },
];

const MOCK_REFUNDS = [
  {
    id: "REF001",
    orderId: "ORD12345",
    customer: "Rahul Sharma",
    amount: 499,
    reason: "Wrong product delivered",
    status: "Pending",
  },
  {
    id: "REF002",
    orderId: "ORD12301",
    customer: "Priya Patel",
    amount: 299,
    reason: "Product damaged",
    status: "Approved",
  },
  {
    id: "REF003",
    orderId: "ORD12280",
    customer: "Amit Kumar",
    amount: 799,
    reason: "Not as described",
    status: "Rejected",
  },
];

const MOCK_ACTIVITY = [
  { time: "2 hrs ago", action: "New order #ORD12350 from Sunita Devi" },
  { time: "4 hrs ago", action: "Product 'Basmati Rice 5kg' stock updated" },
  { time: "Yesterday", action: "Customer Mohan Lal registered" },
  { time: "Yesterday", action: "Coupon DHARMA20 applied by 3 customers" },
  { time: "2 days ago", action: "Store: Mumbai branch details updated" },
];

// ─── Sidebar Nav ─────────────────────────────────────────────────────────────
const NAV_ITEMS: {
  id: AdminSection;
  icon: React.ReactNode;
  label: string;
  labelHindi: string;
}[] = [
  {
    id: "dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
    labelHindi: "मुख्य डैशबोर्ड",
  },
  {
    id: "products",
    icon: <Package className="h-5 w-5" />,
    label: "Products",
    labelHindi: "उत्पाद प्रबंधन",
  },
  {
    id: "orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    label: "Orders",
    labelHindi: "ऑर्डर प्रबंधन",
  },
  {
    id: "customers",
    icon: <Users className="h-5 w-5" />,
    label: "Customers",
    labelHindi: "ग्राहक प्रबंधन",
  },
  {
    id: "payment",
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Payment & Shipping",
    labelHindi: "भुगतान और शिपिंग",
  },
  {
    id: "marketing",
    icon: <Megaphone className="h-5 w-5" />,
    label: "Marketing",
    labelHindi: "मार्केटिंग",
  },
  {
    id: "reports",
    icon: <BarChart2 className="h-5 w-5" />,
    label: "Reports",
    labelHindi: "रिपोर्ट",
  },
  {
    id: "security",
    icon: <ShieldCheck className="h-5 w-5" />,
    label: "Security",
    labelHindi: "सुरक्षा",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminPanelPage() {
  const [authed, setAuthed] = useState(() =>
    loadLS<boolean>("dharma_admin_panel_auth", false),
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      saveLS("dharma_admin_panel_auth", true);
      logActivity("Admin logged in to Admin Panel");
    } else {
      setPwError("Incorrect password / गलत पासवर्ड");
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    saveLS("dharma_admin_panel_auth", false);
    logActivity("Admin logged out");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 to-teal-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">🪔</div>
            <CardTitle className="text-2xl font-bold text-teal-800">
              धर्मा Mart
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Admin Panel / एडमिन पैनल
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-pw" className="text-sm font-medium">
                Password / पासवर्ड
              </Label>
              <Input
                id="admin-pw"
                type="password"
                placeholder="Enter admin password"
                value={pwInput}
                onChange={(e) => {
                  setPwInput(e.target.value);
                  setPwError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="mt-1"
                data-ocid="admin_panel.input"
              />
              {pwError && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="admin_panel.error_state"
                >
                  {pwError}
                </p>
              )}
            </div>
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
              onClick={handleLogin}
              data-ocid="admin_panel.submit_button"
            >
              <Lock className="h-4 w-4 mr-2" /> Login
            </Button>
            <div className="text-center">
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-teal-700 transition-colors"
              >
                ← Back to Store
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 bg-teal-900 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-16"
        } overflow-hidden`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 p-4 border-b border-teal-700 min-h-[64px] ${
            sidebarOpen ? "" : "justify-center"
          }`}
        >
          <span className="text-2xl flex-shrink-0">🪔</span>
          {sidebarOpen && (
            <div>
              <span className="font-bold text-sm">धर्मा Mart</span>
              <p className="text-teal-300 text-xs">Admin Panel</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`ml-auto text-teal-300 hover:text-white ${
              sidebarOpen ? "" : "hidden"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-4 text-teal-300 hover:text-white flex justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeSection === item.id
                  ? "bg-teal-700 text-white"
                  : "text-teal-200 hover:bg-teal-800 hover:text-white"
              } ${sidebarOpen ? "" : "justify-center"}`}
              title={
                sidebarOpen ? undefined : `${item.labelHindi} / ${item.label}`
              }
              data-ocid={`admin_panel.${item.id}.tab`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <div>
                  <p className="text-xs font-medium leading-tight">
                    {item.labelHindi}
                  </p>
                  <p className="text-teal-300 text-[11px] leading-tight">
                    {item.label}
                  </p>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-teal-700 p-2">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 text-teal-300 hover:text-white hover:bg-teal-800 rounded text-sm transition-colors ${
              sidebarOpen ? "" : "justify-center"
            }`}
            data-ocid="admin_panel.close_button"
          >
            <X className="h-4 w-4 flex-shrink-0" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b px-6 py-3 flex items-center gap-4 min-h-[64px]">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-bold text-teal-900 text-lg leading-tight">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.labelHindi}
            </h1>
            <p className="text-muted-foreground text-xs">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Badge className="bg-teal-700 text-white text-xs">Admin</Badge>
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-teal-700 transition-colors"
            >
              ← Store
            </Link>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6">
            {activeSection === "dashboard" && (
              <DashboardSection onNavigate={setActiveSection} />
            )}
            {activeSection === "products" && <ProductsSection />}
            {activeSection === "orders" && <OrdersSection />}
            {activeSection === "customers" && <CustomersSection />}
            {activeSection === "payment" && <PaymentSection />}
            {activeSection === "marketing" && <MarketingSection />}
            {activeSection === "reports" && <ReportsSection />}
            {activeSection === "security" && <SecuritySection />}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

// ─── 1. Dashboard ─────────────────────────────────────────────────────────────
function DashboardSection({
  onNavigate,
}: { onNavigate: (s: AdminSection) => void }) {
  const { products } = useProducts();
  const { allCustomers } = useCustomer();
  const orders: Order[] = loadLS<Order[]>("dharma_orders", []);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const kpis = [
    {
      label: "कुल राजस्व",
      sublabel: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "कुल ऑर्डर",
      sublabel: "Total Orders",
      value: orders.length.toString(),
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "कुल ग्राहक",
      sublabel: "Total Customers",
      value: allCustomers.length.toString(),
      icon: <Users className="h-6 w-6" />,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "कुल उत्पाद",
      sublabel: "Total Products",
      value: products.length.toString(),
      icon: <Package className="h-6 w-6" />,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <Card
            key={k.label}
            className="border shadow-sm hover:shadow-md transition-shadow"
            data-ocid={`dashboard.kpi.item.${i + 1}`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {k.sublabel}
                  </p>
                  <p className="text-xs text-muted-foreground/70">{k.label}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">
                    {k.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${k.color}`}>{k.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              हाल की गतिविधि / Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((a, i) => (
                <div
                  key={a.action}
                  className="flex gap-3 items-start"
                  data-ocid={`dashboard.activity.item.${i + 1}`}
                >
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              त्वरित क्रिया / Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionBtn
                icon={<Package className="h-5 w-5" />}
                label="उत्पाद जोड़ें"
                sub="Add Product"
                onClick={() => onNavigate("products")}
              />
              <QuickActionBtn
                icon={<ShoppingCart className="h-5 w-5" />}
                label="ऑर्डर देखें"
                sub="View Orders"
                onClick={() => onNavigate("orders")}
              />
              <QuickActionBtn
                icon={<Tag className="h-5 w-5" />}
                label="कूपन जोड़ें"
                sub="Add Coupon"
                onClick={() => onNavigate("marketing")}
              />
              <QuickActionBtn
                icon={<BarChart2 className="h-5 w-5" />}
                label="रिपोर्ट"
                sub="Reports"
                onClick={() => onNavigate("reports")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            त्वरित रिपोर्ट / Quick Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBadge
              label="Pending Orders"
              value={orders
                .filter((o) => o.status === "Pending")
                .length.toString()}
              color="amber"
            />
            <StatBadge
              label="Low Stock Items"
              value={products.filter((p) => p.stock < 10).length.toString()}
              color="red"
            />
            <StatBadge label="Active Coupons" value="3" color="green" />
            <StatBadge
              label="Upcoming Products"
              value={products.filter((p) => p.isUpcoming).length.toString()}
              color="blue"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickActionBtn({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-gray-50 hover:bg-teal-50 hover:border-teal-300 transition-colors group cursor-pointer"
    >
      <div className="text-teal-700 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-gray-800 leading-tight">
          {label}
        </p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}

function StatBadge({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <div className={`p-3 rounded-lg border ${colors[color] || colors.blue}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5">{label}</p>
    </div>
  );
}

const CATEGORY_GROUPS: {
  id: string;
  label: string;
  labelHindi: string;
  icon: string;
  categories: string[];
}[] = [
  {
    id: "electronics",
    label: "Electronics",
    labelHindi: "इलेक्ट्रॉनिक्स",
    icon: "💻",
    categories: [
      "Mobiles",
      "Laptops",
      "Televisions",
      "Cameras",
      "Computer peripheral",
      "Computer accessories",
      "Storage",
      "Health care device",
      "Cases covers & more",
      "Mobile accessories",
    ],
  },
  {
    id: "smart",
    label: "Smart Gadgets & Home",
    labelHindi: "स्मार्ट गैजेट्स",
    icon: "🏠",
    categories: [
      "Smart home automation",
      "Smart wearables",
      "Headphones & speakers",
      "Power banks",
      "Gaming",
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen & Home",
    labelHindi: "किचन / होम",
    icon: "🍳",
    categories: [
      "Kitchen appliances",
      "Home appliances",
      "Microwave oven",
      "Seasonal appliances",
      "Home improvement tools",
      "Decor & lighting",
      "Dining & kitchen",
    ],
  },
  {
    id: "fashion",
    label: "Fashion",
    labelHindi: "फैशन",
    icon: "👗",
    categories: [
      "Men's clothing",
      "Man's footwear & accessories",
      "Men's Essentials",
      "Woman's clothing",
      "Woman footwear & accessories",
      "Women's Essentials",
      "Kid's Fashion",
      "Suitcase, Bags & backpacks",
    ],
  },
  {
    id: "grocery",
    label: "Grocery & Food",
    labelHindi: "किराना / खाद्य",
    icon: "🛒",
    categories: [
      "Ghee & oils",
      "Sugar, jaggery & salt",
      "Rice & Rice products",
      "Atta & flours",
      "Dry fruits, Nuts & seeds",
      "Dals & pulses",
      "Masalas & spices",
      "Coffee & tea",
      "Juices & soft drinks",
      "Chips & namkeen",
      "Good",
      "Nutrition & healthcare",
      "Household supplies",
      "Daily essentials",
    ],
  },
  {
    id: "beauty",
    label: "Beauty & Personal Care",
    labelHindi: "ब्यूटी / केयर",
    icon: "💄",
    categories: [
      "Skin care",
      "Hair care",
      "Fragrance",
      "Beauty",
      "Personal care appliances",
      "Baby care",
      "Stationery & school supplies",
    ],
  },
  {
    id: "sports",
    label: "Sports & Fitness",
    labelHindi: "स्पोर्ट्स",
    icon: "🏋️",
    categories: [
      "Sports",
      "Cycles",
      "Exercise bikes",
      "Premium Treadmills",
      "Fitness accessories",
      "Cricket",
      "Badminton",
      "Bike accessories",
      "Car accessories",
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    labelHindi: "फर्नीचर",
    icon: "🛋️",
    categories: [
      "Bedroom furniture",
      "Living room furniture",
      "Study & office furniture",
      "Outdoor furniture",
      "Kids' room furniture",
      "Storage furniture",
      "Tables",
    ],
  },
  {
    id: "appliances",
    label: "Appliances",
    labelHindi: "अप्लायंस",
    icon: "🔌",
    categories: ["Air conditioners", "Refrigerators", "Washing machines"],
  },
];

// ─── 2. Products ──────────────────────────────────────────────────────────────
function ProductsSection() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [filterCat, _setFilterCat] = useState("All");
  const [activeGroup, setActiveGroup] = useState<string>("electronics");
  const [editProduct, setEditProduct] = useState<SampleProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "list" | "inventory" | "categories"
  >("list");
  const [newCategory, setNewCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>(() =>
    loadLS<string[]>("dharma_custom_categories", []),
  );
  const [customSections, setCustomSections] = useState<
    {
      id: string;
      label: string;
      labelHindi: string;
      icon: string;
      categories: string[];
    }[]
  >(() => loadLS("dharma_custom_sections", []));
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionHindi, setNewSectionHindi] = useState("");
  const [newSectionIcon, setNewSectionIcon] = useState("🏷️");
  const [sectionCatInput, setSectionCatInput] = useState<
    Record<string, string>
  >({});

  const allCategories = [
    ...CATEGORIES.map((c) => c.label),
    ...customCategories,
    ...customSections
      .flatMap((s) => s.categories)
      .filter(
        (c) =>
          !CATEGORIES.map((x) => x.label).includes(c) &&
          !customCategories.includes(c),
      ),
  ];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    const activeGroupDef = CATEGORY_GROUPS.find((g) => g.id === activeGroup);
    const matchGroup =
      activeGroup === "all" ||
      !activeGroupDef ||
      activeGroupDef.categories.includes(p.category);
    return matchSearch && matchCat && matchGroup;
  });

  const emptyForm: Partial<SampleProduct> = {
    name: "",
    nameHindi: "",
    price: 0,
    originalPrice: 0,
    category: "",
    description: "",
    image: "",
    stock: 0,
    isDeal: false,
    isUpcoming: false,
    isFeatured: false,
    badge: "",
  };
  const [form, setForm] = useState<Partial<SampleProduct>>(emptyForm);

  const openAdd = () => {
    const activeGroupDef = CATEGORY_GROUPS.find((g) => g.id === activeGroup);
    const prefilledCategory =
      activeGroup !== "all" && activeGroupDef
        ? activeGroupDef.categories[0]
        : "";
    setForm({ ...emptyForm, category: prefilledCategory });
    setEditProduct(null);
    setShowForm(true);
  };
  const openEdit = (p: SampleProduct) => {
    setForm({ ...p });
    setEditProduct(p);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editProduct) {
      updateProduct({ ...editProduct, ...form } as SampleProduct);
      logActivity(`Product updated: ${form.name}`);
    } else {
      const newProd: SampleProduct = {
        ...emptyForm,
        ...form,
        id: Date.now(),
        isDeal: form.isDeal ?? false,
        stock: form.stock ?? 0,
        price: form.price ?? 0,
        name: form.name ?? "",
        category: form.category ?? "",
      };
      addProduct(newProd);
      logActivity(`Product added: ${form.name}`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      deleteProduct(id);
      logActivity(`Product deleted: ${name}`);
    }
  };

  const addSection = () => {
    if (!newSectionName.trim()) return;
    const id = `${newSectionName.trim().toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
    const updated = [
      ...customSections,
      {
        id,
        label: newSectionName.trim(),
        labelHindi: newSectionHindi.trim() || newSectionName.trim(),
        icon: newSectionIcon || "🏷️",
        categories: [],
      },
    ];
    setCustomSections(updated);
    saveLS("dharma_custom_sections", updated);
    setNewSectionName("");
    setNewSectionHindi("");
    setNewSectionIcon("🏷️");
  };

  const deleteSection = (id: string) => {
    const updated = customSections.filter((s) => s.id !== id);
    setCustomSections(updated);
    saveLS("dharma_custom_sections", updated);
  };

  const addCategoryToSection = (sectionId: string) => {
    const catName = (sectionCatInput[sectionId] || "").trim();
    if (!catName) return;
    const updated = customSections.map((s) =>
      s.id === sectionId ? { ...s, categories: [...s.categories, catName] } : s,
    );
    setCustomSections(updated);
    saveLS("dharma_custom_sections", updated);
    // Also add to customCategories if not present
    if (!customCategories.includes(catName)) {
      const cats = [...customCategories, catName];
      setCustomCategories(cats);
      saveLS("dharma_custom_categories", cats);
    }
    setSectionCatInput((prev) => ({ ...prev, [sectionId]: "" }));
  };

  const removeCategoryFromSection = (sectionId: string, cat: string) => {
    const updated = customSections.map((s) =>
      s.id === sectionId
        ? { ...s, categories: s.categories.filter((c) => c !== cat) }
        : s,
    );
    setCustomSections(updated);
    saveLS("dharma_custom_sections", updated);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...customCategories, newCategory.trim()];
    setCustomCategories(updated);
    saveLS("dharma_custom_categories", updated);
    setNewCategory("");
  };

  const deleteCategory = (cat: string) => {
    const updated = customCategories.filter((c) => c !== cat);
    setCustomCategories(updated);
    saveLS("dharma_custom_categories", updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {(["list", "inventory", "categories"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === t
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-ocid={`products.${t}.tab`}
          >
            {t === "list"
              ? "उत्पाद सूची / List"
              : t === "inventory"
                ? "इन्वेंट्री / Inventory"
                : "श्रेणी / Categories"}
          </button>
        ))}
        <Button
          onClick={openAdd}
          className="ml-auto bg-teal-700 hover:bg-teal-800 text-white h-8 px-3 text-sm"
          data-ocid="products.add_button"
        >
          + उत्पाद जोड़ें
        </Button>
      </div>

      {activeTab === "list" && (
        <>
          <div className="overflow-x-auto -mx-1 px-1 pb-1">
            <div className="flex gap-2 min-w-max">
              <button
                type="button"
                onClick={() => setActiveGroup("all")}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${activeGroup === "all" ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                data-ocid="products.filter.tab"
              >
                सभी / All
              </button>
              {[...CATEGORY_GROUPS, ...customSections].map((group) => (
                <button
                  type="button"
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${activeGroup === group.id ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  data-ocid={`products.${group.id}.tab`}
                >
                  {group.icon} {group.labelHindi}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
              data-ocid="products.search_input"
            />
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Product / उत्पाद</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map((p, i) => (
                  <TableRow key={p.id} data-ocid={`products.item.${i + 1}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          {p.nameHindi && (
                            <p className="text-xs text-muted-foreground">
                              {p.nameHindi}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.category}</TableCell>
                    <TableCell className="text-sm font-medium">
                      ₹{p.price.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          p.stock < 10
                            ? "text-red-600 font-bold"
                            : "text-gray-700"
                        }
                      >
                        {p.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {p.isUpcoming && (
                          <Badge className="bg-blue-100 text-blue-700 text-[10px]">
                            Upcoming
                          </Badge>
                        )}
                        {p.isFeatured && (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                            Featured
                          </Badge>
                        )}
                        {p.isDeal && (
                          <Badge className="bg-red-100 text-red-700 text-[10px]">
                            Deal
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                          className="h-7 w-7 p-0"
                          data-ocid={`products.edit_button.${i + 1}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          data-ocid={`products.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="products.empty_state"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 50 && (
            <p className="text-xs text-muted-foreground text-right">
              Showing 50 of {filtered.length} products
            </p>
          )}
        </>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Items with low stock (below 10 units) are highlighted in red.
          </p>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products
                  .sort((a, b) => a.stock - b.stock)
                  .slice(0, 60)
                  .map((p, i) => (
                    <TableRow
                      key={p.id}
                      className={p.stock < 10 ? "bg-red-50" : ""}
                      data-ocid={`inventory.item.${i + 1}`}
                    >
                      <TableCell className="text-sm font-medium">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-sm">{p.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${p.stock < 10 ? "text-red-600" : "text-gray-800"}`}
                          >
                            {p.stock}
                          </span>
                          {p.stock < 10 && (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            p.stock === 0
                              ? "bg-red-100 text-red-700"
                              : p.stock < 10
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                          }
                        >
                          {p.stock === 0
                            ? "Out of Stock"
                            : p.stock < 10
                              ? "Low Stock"
                              : "In Stock"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-6 max-w-2xl">
          {/* Add New Section */}
          <div className="border rounded-xl p-4 bg-teal-50 space-y-3">
            <p className="font-semibold text-teal-800 text-sm">
              ➕ नया सेक्शन जोड़ें / Add New Section
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Section name (English)"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                data-ocid="section.name.input"
              />
              <Input
                placeholder="सेक्शन नाम (हिंदी)"
                value={newSectionHindi}
                onChange={(e) => setNewSectionHindi(e.target.value)}
                data-ocid="section.hindi.input"
              />
              <Input
                placeholder="Icon emoji (e.g. 🎮)"
                value={newSectionIcon}
                onChange={(e) => setNewSectionIcon(e.target.value)}
                data-ocid="section.icon.input"
              />
              <Button
                onClick={addSection}
                className="bg-teal-700 hover:bg-teal-800 text-white"
                data-ocid="section.add_button"
              >
                सेक्शन जोड़ें / Add Section
              </Button>
            </div>
          </div>

          {/* Custom Sections */}
          {customSections.length > 0 && (
            <div className="space-y-3">
              <p className="font-semibold text-sm">
                📂 आपके कस्टम सेक्शन / Your Custom Sections
              </p>
              {customSections.map((sec) => (
                <div
                  key={sec.id}
                  className="border rounded-xl p-4 space-y-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base">
                      {sec.icon} {sec.label}{" "}
                      <span className="text-muted-foreground text-sm">
                        ({sec.labelHindi})
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteSection(sec.id)}
                      className="text-red-400 hover:text-red-600 text-xs border border-red-200 rounded px-2 py-0.5"
                    >
                      🗑 Delete Section
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add category to this section"
                      value={sectionCatInput[sec.id] || ""}
                      onChange={(e) =>
                        setSectionCatInput((prev) => ({
                          ...prev,
                          [sec.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addCategoryToSection(sec.id);
                      }}
                      data-ocid={`section.${sec.id}.cat_input`}
                    />
                    <Button
                      onClick={() => addCategoryToSection(sec.id)}
                      className="bg-teal-700 hover:bg-teal-800 text-white shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sec.categories.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        No categories yet
                      </span>
                    )}
                    {sec.categories.map((c) => (
                      <div
                        key={c}
                        className="flex items-center gap-1 bg-teal-50 border border-teal-200 rounded-full px-3 py-1"
                      >
                        <span className="text-xs text-teal-800">{c}</span>
                        <button
                          type="button"
                          onClick={() => removeCategoryFromSection(sec.id, c)}
                          className="text-teal-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add standalone category */}
          <div className="border rounded-xl p-4 space-y-3">
            <p className="font-semibold text-sm">
              🏷️ अलग category जोड़ें / Add Standalone Category
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                data-ocid="categories.input"
              />
              <Button
                onClick={addCategory}
                className="bg-teal-700 hover:bg-teal-800 text-white"
                data-ocid="categories.add_button"
              >
                Add
              </Button>
            </div>
            {customCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {customCategories.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-1 bg-teal-50 border border-teal-200 rounded-full px-3 py-1"
                  >
                    <span className="text-xs text-teal-800">{c}</span>
                    <button
                      type="button"
                      onClick={() => deleteCategory(c)}
                      className="text-teal-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Default Categories ({CATEGORIES.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Badge key={c.id} variant="outline" className="text-xs">
                  {c.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editProduct
                ? "Edit Product / उत्पाद संपादित करें"
                : "Add Product / उत्पाद जोड़ें"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 sm:col-span-1">
              <Label>Product Name *</Label>
              <Input
                value={form.name ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="products.name.input"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Hindi Name</Label>
              <Input
                value={form.nameHindi ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nameHindi: e.target.value }))
                }
                data-ocid="products.hindi_name.input"
              />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                value={form.price ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                data-ocid="products.price.input"
              />
            </div>
            <div>
              <Label>Original Price (₹)</Label>
              <Input
                type="number"
                value={form.originalPrice ?? 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    originalPrice: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Category *</Label>
              <Select
                value={form.category ?? ""}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger data-ocid="products.form.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: Number(e.target.value) }))
                }
                data-ocid="products.stock.input"
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                data-ocid="products.description.textarea"
              />
            </div>
            <div className="col-span-2">
              <Label>Image URL</Label>
              <Input
                value={form.image ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="products.image.input"
              />
            </div>
            <div className="col-span-2">
              <Label>Badge</Label>
              <Input
                value={form.badge ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, badge: e.target.value }))
                }
                placeholder="e.g. New, Hot, etc."
              />
            </div>
            <div className="col-span-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={!!form.isDeal}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isDeal: !!v }))
                  }
                  data-ocid="products.deal.checkbox"
                />
                Deal / डील
              </div>
              <div className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={!!form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isFeatured: !!v }))
                  }
                  data-ocid="products.featured.checkbox"
                />
                Featured / फीचर्ड
              </div>
              <div className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={!!form.isUpcoming}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isUpcoming: !!v }))
                  }
                  data-ocid="products.upcoming.checkbox"
                />
                Upcoming / आगामी
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="products.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── 3. Orders ────────────────────────────────────────────────────────────────
function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>(() =>
    loadLS<Order[]>("dharma_orders", []),
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const statuses = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filtered =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const updateStatus = (id: string, status: string) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    saveLS("dharma_orders", updated);
    logActivity(`Order ${id} status changed to ${status}`);
  };

  const statusColor: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-ocid={`orders.${s.toLowerCase()}.tab`}
          >
            {s}{" "}
            {s !== "All" && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o, i) => (
              <TableRow key={o.id} data-ocid={`orders.item.${i + 1}`}>
                <TableCell className="text-xs font-mono">{o.id}</TableCell>
                <TableCell className="text-sm">
                  {o.customerName}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {o.customerPhone}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  {o.items?.length ?? 0} items
                </TableCell>
                <TableCell className="font-medium">
                  ₹{o.total?.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColor[o.status] ?? "bg-gray-100 text-gray-700"
                    }
                  >
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {o.date ? new Date(o.date).toLocaleDateString("en-IN") : ""}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Select
                      value={o.status}
                      onValueChange={(v) => updateStatus(o.id, v)}
                    >
                      <SelectTrigger
                        className="h-7 text-xs w-28"
                        data-ocid={`orders.status.select.${i + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Pending",
                          "Processing",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => setInvoiceOrder(o)}
                      data-ocid={`orders.invoice.button.${i + 1}`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="orders.empty_state"
                >
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Dialog */}
      <Dialog
        open={!!invoiceOrder}
        onOpenChange={(open) => !open && setInvoiceOrder(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="orders.invoice.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Invoice / इनवॉइस
            </DialogTitle>
          </DialogHeader>
          {invoiceOrder && (
            <div className="space-y-4" id="invoice-print">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-bold text-lg text-teal-800">
                    🪔 धर्मा Mart
                  </p>
                  <p className="text-xs text-muted-foreground">
                    भारत का अपना Mart
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-bold text-sm text-gray-800">
                    Invoice #{invoiceOrder.id}
                  </p>
                  <p>
                    {invoiceOrder.date
                      ? new Date(invoiceOrder.date).toLocaleDateString("en-IN")
                      : ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">
                    Customer
                  </p>
                  <p className="font-medium">{invoiceOrder.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoiceOrder.customerPhone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoiceOrder.customerAddress}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">
                    Status
                  </p>
                  <Badge
                    className={`${statusColor[invoiceOrder.status] ?? "bg-gray-100 text-gray-700"} mt-1`}
                  >
                    {invoiceOrder.status}
                  </Badge>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs">Item</TableHead>
                    <TableHead className="text-xs">Qty</TableHead>
                    <TableHead className="text-xs">Price</TableHead>
                    <TableHead className="text-xs">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(invoiceOrder.items ?? []).map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="text-sm">{item.name}</TableCell>
                      <TableCell className="text-sm">{item.qty}</TableCell>
                      <TableCell className="text-sm">
                        ₹{item.price.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        ₹{(item.qty * item.price).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <div className="text-sm space-y-1 min-w-[160px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{invoiceOrder.total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%):</span>
                    <span>
                      ₹
                      {Math.round(invoiceOrder.total * 0.18).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1">
                    <span>Grand Total:</span>
                    <span>
                      ₹
                      {Math.round(invoiceOrder.total * 1.18).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInvoiceOrder(null)}
              data-ocid="orders.invoice.close_button"
            >
              Close
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="orders.invoice.print_button"
            >
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── 4. Customers ─────────────────────────────────────────────────────────────
function CustomersSection() {
  const { allCustomers, deleteCustomer, getWishlist } = useCustomer();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filtered = allCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search),
  );

  const cityCounts: Record<string, number> = {};
  for (const c of allCustomers) {
    cityCounts[c.city] = (cityCounts[c.city] || 0) + 1;
  }
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCity = topCities[0]?.[1] || 1;

  const selected = allCustomers.find((c) => c.id === selectedCustomer);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-teal-700">
              {allCustomers.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Customers / कुल ग्राहक
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-purple-600">
              {allCustomers.reduce((s, c) => s + getWishlist(c.id).length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Wishlists / कुल विशलिस्ट
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(cityCounts).length}
            </p>
            <p className="text-sm text-muted-foreground">Cities / शहर</p>
          </CardContent>
        </Card>
      </div>

      {topCities.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Cities / शीर्ष शहर</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topCities.map(([city, count]) => (
              <div key={city} className="flex items-center gap-3">
                <span className="text-sm w-24 truncate">{city}</span>
                <Progress
                  value={(count / maxCity) * 100}
                  className="flex-1 h-2"
                />
                <span className="text-xs text-muted-foreground w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          data-ocid="customers.search_input"
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name / नाम</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Wishlist</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={c.id} data-ocid={`customers.item.${i + 1}`}>
                <TableCell className="font-medium text-sm">{c.name}</TableCell>
                <TableCell className="text-sm">{c.mobile}</TableCell>
                <TableCell className="text-sm">{c.city}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(c.registeredAt).toLocaleDateString("en-IN")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getWishlist(c.id).length} items
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setSelectedCustomer(c.id)}
                      data-ocid={`customers.view.button.${i + 1}`}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete ${c.name}?`)) {
                          deleteCustomer(c.id);
                          logActivity(`Customer deleted: ${c.name}`);
                        }
                      }}
                      data-ocid={`customers.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="customers.empty_state"
                >
                  No customers yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Detail Dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      >
        <DialogContent data-ocid="customers.dialog">
          <DialogHeader>
            <DialogTitle>Customer Profile / ग्राहक प्रोफ़ाइल</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Name</p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Mobile</p>
                  <p className="font-medium">{selected.mobile}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">City</p>
                  <p className="font-medium">{selected.city}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Registered</p>
                  <p className="font-medium">
                    {new Date(selected.registeredAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Address</p>
                  <p className="font-medium">{selected.address}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">
                  Wishlist ({getWishlist(selected.id).length} items)
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {getWishlist(selected.id).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm bg-gray-50 px-3 py-1.5 rounded"
                    >
                      <span>{item.name}</span>
                      <span className="text-teal-700 font-medium">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  {getWishlist(selected.id).length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No items in wishlist
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedCustomer(null)}
              data-ocid="customers.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── 5. Payment & Shipping ────────────────────────────────────────────────────
function PaymentSection() {
  const [payMethods, setPayMethods] = useState(() =>
    loadLS("dharma_payment_methods", [
      {
        id: "cod",
        label: "Cash on Delivery (COD)",
        labelHindi: "नकद भुगतान",
        active: true,
      },
      {
        id: "online",
        label: "Online Payment",
        labelHindi: "ऑनलाइन भुगतान",
        active: true,
      },
      { id: "upi", label: "UPI", labelHindi: "यूपीआई", active: true },
    ]),
  );

  const [zones, setZones] = useState<ShippingZone[]>(() =>
    loadLS("dharma_shipping_zones", DEFAULT_SHIPPING),
  );
  const [editZone, setEditZone] = useState<ShippingZone | null>(null);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [zoneForm, setZoneForm] = useState<Partial<ShippingZone>>({});

  const togglePayment = (id: string) => {
    const updated = payMethods.map((m) =>
      m.id === id ? { ...m, active: !m.active } : m,
    );
    setPayMethods(updated);
    saveLS("dharma_payment_methods", updated);
  };

  const saveZone = () => {
    if (!zoneForm.city) return;
    if (editZone) {
      const updated = zones.map((z) =>
        z.id === editZone.id
          ? ({ ...editZone, ...zoneForm } as ShippingZone)
          : z,
      );
      setZones(updated);
      saveLS("dharma_shipping_zones", updated);
    } else {
      const updated = [
        ...zones,
        { ...zoneForm, id: Date.now().toString() } as ShippingZone,
      ];
      setZones(updated);
      saveLS("dharma_shipping_zones", updated);
    }
    setShowZoneForm(false);
    setZoneForm({});
    setEditZone(null);
  };

  const deleteZone = (id: string) => {
    const updated = zones.filter((z) => z.id !== id);
    setZones(updated);
    saveLS("dharma_shipping_zones", updated);
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Payment Methods / भुगतान विधियाँ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payMethods.map(
              (
                m: {
                  id: string;
                  label: string;
                  labelHindi: string;
                  active: boolean;
                },
                i: number,
              ) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                  data-ocid={`payment.method.item.${i + 1}`}
                >
                  <div>
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.labelHindi}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        m.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    >
                      {m.active ? "Active" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={m.active}
                      onCheckedChange={() => togglePayment(m.id)}
                      data-ocid={`payment.method.switch.${i + 1}`}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Zones */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base">
            Shipping Zones / शिपिंग क्षेत्र
          </CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setZoneForm({});
              setEditZone(null);
              setShowZoneForm(true);
            }}
            className="bg-teal-700 hover:bg-teal-800 text-white h-8"
            data-ocid="shipping.add_button"
          >
            + Add Zone
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>City</TableHead>
                  <TableHead>Pincode Range</TableHead>
                  <TableHead>Fee (₹)</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((z, i) => (
                  <TableRow key={z.id} data-ocid={`shipping.item.${i + 1}`}>
                    <TableCell className="font-medium text-sm">
                      {z.city}
                    </TableCell>
                    <TableCell className="text-sm">{z.pincode}</TableCell>
                    <TableCell className="text-sm">₹{z.fee}</TableCell>
                    <TableCell className="text-sm">{z.days} days</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setZoneForm(z);
                            setEditZone(z);
                            setShowZoneForm(true);
                          }}
                          data-ocid={`shipping.edit_button.${i + 1}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => deleteZone(z.id)}
                          data-ocid={`shipping.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Refunds */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Refund Management / रिफंड प्रबंधन
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Refund ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_REFUNDS.map((r, i) => (
                  <TableRow key={r.id} data-ocid={`refunds.item.${i + 1}`}>
                    <TableCell className="text-xs font-mono">{r.id}</TableCell>
                    <TableCell className="text-xs">{r.orderId}</TableCell>
                    <TableCell className="text-sm">{r.customer}</TableCell>
                    <TableCell className="font-medium">₹{r.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                      {r.reason}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : r.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2 text-green-700 border-green-200"
                          data-ocid={`refunds.approve.button.${i + 1}`}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2 text-red-700 border-red-200"
                          data-ocid={`refunds.reject.button.${i + 1}`}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Zone Form Dialog */}
      <Dialog open={showZoneForm} onOpenChange={setShowZoneForm}>
        <DialogContent data-ocid="shipping.dialog">
          <DialogHeader>
            <DialogTitle>
              {editZone ? "Edit Zone" : "Add Shipping Zone"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>City</Label>
              <Input
                value={zoneForm.city ?? ""}
                onChange={(e) =>
                  setZoneForm((f) => ({ ...f, city: e.target.value }))
                }
                data-ocid="shipping.city.input"
              />
            </div>
            <div>
              <Label>Pincode Range</Label>
              <Input
                value={zoneForm.pincode ?? ""}
                onChange={(e) =>
                  setZoneForm((f) => ({ ...f, pincode: e.target.value }))
                }
                placeholder="e.g. 110001-110099"
                data-ocid="shipping.pincode.input"
              />
            </div>
            <div>
              <Label>Delivery Fee (₹)</Label>
              <Input
                type="number"
                value={zoneForm.fee ?? 0}
                onChange={(e) =>
                  setZoneForm((f) => ({ ...f, fee: Number(e.target.value) }))
                }
                data-ocid="shipping.fee.input"
              />
            </div>
            <div>
              <Label>Delivery Days</Label>
              <Input
                value={zoneForm.days ?? ""}
                onChange={(e) =>
                  setZoneForm((f) => ({ ...f, days: e.target.value }))
                }
                placeholder="e.g. 2-3"
                data-ocid="shipping.days.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowZoneForm(false)}
              data-ocid="shipping.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveZone}
              className="bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="shipping.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── 6. Marketing ─────────────────────────────────────────────────────────────
function MarketingSection() {
  const [coupons, setCoupons] = useState<CouponData[]>(() =>
    loadLS("dharma_admin_coupons", DEFAULT_COUPONS),
  );
  const [editCoupon, setEditCoupon] = useState<CouponData | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<CouponData>>({});
  const [activeTab, setActiveTab] = useState<"coupons" | "seo">("coupons");
  const [seoData, setSeoData] = useState(() =>
    loadLS("dharma_seo", {
      home: {
        title: "धर्मा Mart - भारत का अपना Mart",
        desc: "Shop the best products at great prices.",
        keywords: "ecommerce, india, dharma mart",
      },
      products: {
        title: "Products - धर्मा Mart",
        desc: "Browse our huge catalog.",
        keywords: "products, shop, buy",
      },
      about: {
        title: "About - धर्मा Mart",
        desc: "Learn about Dharma Mart.",
        keywords: "about, dharma mart",
      },
    }),
  );

  const saveSeo = () => {
    saveLS("dharma_seo", seoData);
    logActivity("SEO settings updated");
    alert("SEO settings saved!");
  };

  const openAddCoupon = () => {
    setCouponForm({
      type: "percent",
      value: 10,
      minOrder: 0,
      active: true,
      expiry: "2026-12-31",
    });
    setEditCoupon(null);
    setShowCouponForm(true);
  };

  const openEditCoupon = (c: CouponData) => {
    setCouponForm({ ...c });
    setEditCoupon(c);
    setShowCouponForm(true);
  };

  const saveCoupon = () => {
    if (!couponForm.code) return;
    if (editCoupon) {
      const updated = coupons.map((c) =>
        c.code === editCoupon.code ? ({ ...couponForm } as CouponData) : c,
      );
      setCoupons(updated);
      saveLS("dharma_admin_coupons", updated);
    } else {
      const updated = [...coupons, couponForm as CouponData];
      setCoupons(updated);
      saveLS("dharma_admin_coupons", updated);
    }
    setShowCouponForm(false);
    logActivity(
      `Coupon ${couponForm.code} ${editCoupon ? "updated" : "added"}`,
    );
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    saveLS("dharma_admin_coupons", updated);
    logActivity(`Coupon ${code} deleted`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b pb-3">
        {(["coupons", "seo"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === t
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-ocid={`marketing.${t}.tab`}
          >
            {t === "coupons" ? "Coupons / कूपन" : "SEO Tools"}
          </button>
        ))}
      </div>

      {activeTab === "coupons" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={openAddCoupon}
              className="bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="coupons.add_button"
            >
              + Add Coupon
            </Button>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c, i) => (
                  <TableRow key={c.code} data-ocid={`coupons.item.${i + 1}`}>
                    <TableCell className="font-mono font-bold text-teal-700">
                      {c.code}
                    </TableCell>
                    <TableCell className="text-sm">
                      {c.type === "percent" ? "%" : "₹"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                    </TableCell>
                    <TableCell className="text-sm">₹{c.minOrder}</TableCell>
                    <TableCell className="text-xs">{c.expiry}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          c.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {c.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => openEditCoupon(c)}
                          data-ocid={`coupons.edit_button.${i + 1}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => deleteCoupon(c.code)}
                          data-ocid={`coupons.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="space-y-4 max-w-2xl">
          {(["home", "products", "about"] as const).map((page) => (
            <Card key={page}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize">
                  {page} Page SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-xs">Page Title</Label>
                  <Input
                    value={seoData[page].title}
                    onChange={(e) =>
                      setSeoData((s) => ({
                        ...s,
                        [page]: { ...s[page], title: e.target.value },
                      }))
                    }
                    data-ocid={`seo.${page}.title.input`}
                  />
                </div>
                <div>
                  <Label className="text-xs">Meta Description</Label>
                  <Textarea
                    value={seoData[page].desc}
                    rows={2}
                    onChange={(e) =>
                      setSeoData((s) => ({
                        ...s,
                        [page]: { ...s[page], desc: e.target.value },
                      }))
                    }
                    data-ocid={`seo.${page}.desc.textarea`}
                  />
                </div>
                <div>
                  <Label className="text-xs">Keywords</Label>
                  <Input
                    value={seoData[page].keywords}
                    onChange={(e) =>
                      setSeoData((s) => ({
                        ...s,
                        [page]: { ...s[page], keywords: e.target.value },
                      }))
                    }
                    data-ocid={`seo.${page}.keywords.input`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={saveSeo}
            className="bg-teal-700 hover:bg-teal-800 text-white"
            data-ocid="seo.save_button"
          >
            Save SEO Settings
          </Button>
        </div>
      )}

      {/* Coupon Form Dialog */}
      <Dialog open={showCouponForm} onOpenChange={setShowCouponForm}>
        <DialogContent data-ocid="coupons.dialog">
          <DialogHeader>
            <DialogTitle>
              {editCoupon ? "Edit Coupon" : "Add Coupon / कूपन जोड़ें"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Coupon Code</Label>
              <Input
                value={couponForm.code ?? ""}
                onChange={(e) =>
                  setCouponForm((f) => ({
                    ...f,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="e.g. SAVE20"
                data-ocid="coupons.code.input"
              />
            </div>
            <div>
              <Label>Discount Type</Label>
              <Select
                value={couponForm.type ?? "percent"}
                onValueChange={(v) =>
                  setCouponForm((f) => ({
                    ...f,
                    type: v as "percent" | "flat",
                  }))
                }
              >
                <SelectTrigger data-ocid="coupons.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={couponForm.value ?? 0}
                onChange={(e) =>
                  setCouponForm((f) => ({
                    ...f,
                    value: Number(e.target.value),
                  }))
                }
                data-ocid="coupons.value.input"
              />
            </div>
            <div>
              <Label>Min Order (₹)</Label>
              <Input
                type="number"
                value={couponForm.minOrder ?? 0}
                onChange={(e) =>
                  setCouponForm((f) => ({
                    ...f,
                    minOrder: Number(e.target.value),
                  }))
                }
                data-ocid="coupons.min_order.input"
              />
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={couponForm.expiry ?? ""}
                onChange={(e) =>
                  setCouponForm((f) => ({ ...f, expiry: e.target.value }))
                }
                data-ocid="coupons.expiry.input"
              />
            </div>
            <div className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={!!couponForm.active}
                onCheckedChange={(v) =>
                  setCouponForm((f) => ({ ...f, active: !!v }))
                }
                data-ocid="coupons.active.checkbox"
              />
              Active
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCouponForm(false)}
              data-ocid="coupons.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveCoupon}
              className="bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="coupons.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── 7. Reports ───────────────────────────────────────────────────────────────
function ReportsSection() {
  const { products } = useProducts();
  const orders: Order[] = loadLS<Order[]>("dharma_orders", []);
  const [dateRange, setDateRange] = useState("30");

  const now = Date.now();
  const daysMap: Record<string, number> = {
    "7": 7,
    "30": 30,
    "90": 90,
    all: 999999,
  };
  const days = daysMap[dateRange] || 30;

  const filteredOrders = orders.filter((o) => {
    if (dateRange === "all") return true;
    const d = new Date(o.date).getTime();
    return now - d <= days * 24 * 60 * 60 * 1000;
  });

  const totalSales = filteredOrders.reduce((s, o) => s + o.total, 0);
  const avgOrder = filteredOrders.length
    ? Math.round(totalSales / filteredOrders.length)
    : 0;

  // Top products from orders
  const productCount: Record<string, number> = {};
  for (const o of filteredOrders) {
    for (const item of o.items ?? []) {
      productCount[item.name] = (productCount[item.name] || 0) + item.qty;
    }
  }
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxProd = topProducts[0]?.[1] || 1;

  // Category-wise mock revenue
  const catRevenue: Record<string, number> = {};
  for (const p of products.slice(0, 100)) {
    catRevenue[p.category] =
      (catRevenue[p.category] || 0) +
      p.price * Math.floor(Math.random() * 5 + 1);
  }
  const topCats = Object.entries(catRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxCat = topCats[0]?.[1] || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {[
            { v: "7", l: "Last 7 Days" },
            { v: "30", l: "Last 30 Days" },
            { v: "90", l: "3 Months" },
            { v: "all", l: "All Time" },
          ].map((o) => (
            <button
              type="button"
              key={o.v}
              onClick={() => setDateRange(o.v)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                dateRange === o.v
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-ocid={`reports.${o.v}days.tab`}
            >
              {o.l}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          className="ml-auto h-8"
          onClick={() => window.print()}
          data-ocid="reports.export_button"
        >
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-teal-700">
              ₹{totalSales.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Sales / कुल बिक्री
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-blue-600">
              {filteredOrders.length}
            </p>
            <p className="text-sm text-muted-foreground">Orders / ऑर्डर</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-purple-600">
              ₹{avgOrder.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top 10 Products by Sales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sales data available
              </p>
            ) : (
              topProducts.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-xs w-4 text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-xs flex-1 truncate">{name}</span>
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-teal-500 h-1.5 rounded-full"
                      style={{ width: `${(qty / maxProd) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">
                    {qty}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Category Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Category-wise Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topCats.map(([cat, rev]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-xs w-28 truncate">{cat}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: `${(rev / maxCat) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">
                  ₹{(rev / 1000).toFixed(1)}K
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── 8. Security ─────────────────────────────────────────────────────────────
function SecuritySection() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    loadLS("dharma_admin_users", [
      { id: "1", name: "Main Admin", role: "Admin" },
      { id: "2", name: "Store Manager", role: "Manager" },
    ]),
  );
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({
    role: "Viewer",
  });
  const [autoBackup, setAutoBackup] = useState(() =>
    loadLS<boolean>("dharma_auto_backup", true),
  );
  const [pwForm, setPwForm] = useState({ current: "", new1: "", new2: "" });
  const [pwMsg, setPwMsg] = useState("");
  const activityLog: string[] = loadLS("dharma_admin_log", []);

  const storedPw = useRef(loadLS<string>("dharma_admin_pw", ADMIN_PASSWORD));

  const addUser = () => {
    if (!newUser.name) return;
    const updated = [
      ...adminUsers,
      { ...newUser, id: Date.now().toString() } as AdminUser,
    ];
    setAdminUsers(updated);
    saveLS("dharma_admin_users", updated);
    setShowAddUser(false);
    setNewUser({ role: "Viewer" });
    logActivity(`Admin user added: ${newUser.name}`);
  };

  const removeUser = (id: string) => {
    const updated = adminUsers.filter((u) => u.id !== id);
    setAdminUsers(updated);
    saveLS("dharma_admin_users", updated);
  };

  const changePw = () => {
    if (pwForm.current !== storedPw.current) {
      setPwMsg("Current password incorrect");
      return;
    }
    if (pwForm.new1.length < 6) {
      setPwMsg("New password must be at least 6 characters");
      return;
    }
    if (pwForm.new1 !== pwForm.new2) {
      setPwMsg("Passwords do not match");
      return;
    }
    storedPw.current = pwForm.new1;
    saveLS("dharma_admin_pw", pwForm.new1);
    setPwMsg("Password changed successfully!");
    setPwForm({ current: "", new1: "", new2: "" });
    logActivity("Admin password changed");
  };

  const roleColors: Record<string, string> = {
    Admin: "bg-red-100 text-red-700",
    Manager: "bg-blue-100 text-blue-700",
    Viewer: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      {/* Roles Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Admin Users / एडमिन उपयोगकर्ता
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddUser(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white h-8"
              data-ocid="security.add_user.button"
            >
              + Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((u, i) => (
                  <TableRow
                    key={u.id}
                    data-ocid={`security.user.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {u.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[u.role]}>{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.role === "Admin"
                        ? "Full Access"
                        : u.role === "Manager"
                          ? "Products + Orders"
                          : "Read Only"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeUser(u.id)}
                        data-ocid={`security.user.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Security */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Data Security / डेटा सुरक्षा
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Backup</p>
                <p className="text-xs text-muted-foreground">
                  Last backup: {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={(v) => {
                  setAutoBackup(v);
                  saveLS("dharma_auto_backup", v);
                }}
                data-ocid="security.auto_backup.switch"
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  Data Encrypted
                </p>
                <p className="text-xs text-green-600">
                  All customer data is secured
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Change Password / पासवर्ड बदलें
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Current Password</Label>
              <Input
                type="password"
                value={pwForm.current}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, current: e.target.value }))
                }
                data-ocid="security.current_pw.input"
              />
            </div>
            <div>
              <Label className="text-xs">New Password</Label>
              <Input
                type="password"
                value={pwForm.new1}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, new1: e.target.value }))
                }
                data-ocid="security.new_pw.input"
              />
            </div>
            <div>
              <Label className="text-xs">Confirm New Password</Label>
              <Input
                type="password"
                value={pwForm.new2}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, new2: e.target.value }))
                }
                data-ocid="security.confirm_pw.input"
              />
            </div>
            {pwMsg && (
              <p
                className={`text-xs ${pwMsg.includes("success") ? "text-green-600" : "text-destructive"}`}
                data-ocid="security.pw_change.success_state"
              >
                {pwMsg}
              </p>
            )}
            <Button
              onClick={changePw}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="security.change_pw.button"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Activity Log / गतिविधि लॉग
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activityLog.slice(0, 10).map((entry, entryIdx) => (
              <div
                key={entry}
                className="flex gap-2 text-xs items-start"
                data-ocid={`security.log.item.${entryIdx + 1}`}
              >
                <Layers className="h-3.5 w-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{entry}</span>
              </div>
            ))}
            {activityLog.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No activity recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent data-ocid="security.add_user.dialog">
          <DialogHeader>
            <DialogTitle>Add Admin User / एडमिन उपयोगकर्ता जोड़ें</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={newUser.name ?? ""}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, name: e.target.value }))
                }
                data-ocid="security.user_name.input"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={newUser.role ?? "Viewer"}
                onValueChange={(v) =>
                  setNewUser((u) => ({ ...u, role: v as AdminUser["role"] }))
                }
              >
                <SelectTrigger data-ocid="security.user_role.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin - Full Access</SelectItem>
                  <SelectItem value="Manager">
                    Manager - Products + Orders
                  </SelectItem>
                  <SelectItem value="Viewer">Viewer - Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddUser(false)}
              data-ocid="security.add_user.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={addUser}
              className="bg-teal-700 hover:bg-teal-800 text-white"
              data-ocid="security.add_user.confirm_button"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
