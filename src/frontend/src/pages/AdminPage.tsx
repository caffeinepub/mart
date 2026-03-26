import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { type Customer, useCustomer } from "@/context/CustomerContext";
import { useProducts } from "@/context/ProductsContext";
import { useStores } from "@/context/StoresContext";
import {
  CATEGORIES,
  type SampleProduct,
  type SampleStore,
} from "@/data/sampleData";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  BarChart2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  MapPin,
  Package,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getClassicAdminPw() {
  return localStorage.getItem("dharma_admin_classic_pw") || "dharma@admin123";
}

interface NewStore {
  city: string;
  address: string;
  phone: string;
  pincode: string;
}

interface NewProductForm {
  name: string;
  nameHindi: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  badge: string;
  description: string;
  details: string;
  showcase: string;
  specifications: string;
  warranty: string;
  manufacturerInfo: string;
  colors: string;
  image: string;
  image2: string;
  image3: string;
  isFeatured: boolean;
  isDeal: boolean;
  isUpcoming: boolean;
}

const EMPTY_PRODUCT_FORM: NewProductForm = {
  name: "",
  nameHindi: "",
  price: "",
  originalPrice: "",
  category: "electronics",
  stock: "10",
  badge: "",
  description: "",
  details: "",
  showcase: "",
  specifications: "",
  warranty: "",
  manufacturerInfo: "",
  colors: "",
  image: "",
  image2: "",
  image3: "",
  isFeatured: false,
  isDeal: false,
  isUpcoming: false,
};

export function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const {
    stores,
    addStore: addStoreCtx,
    updateStore: updateStoreCtx,
    deleteStore: deleteStoreCtx,
  } = useStores();
  const loadingStores = false;
  const { actor } = useActor();
  const { allCustomers, deleteCustomer, getWishlist } = useCustomer();
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct: deleteProductCtx,
  } = useProducts();

  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [newStore, setNewStore] = useState<NewStore>({
    city: "",
    address: "",
    phone: "",
    pincode: "",
  });

  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<SampleProduct | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] =
    useState<NewProductForm>(EMPTY_PRODUCT_FORM);

  const [editStore, setEditStore] = useState<
    (NewStore & { id: number }) | null
  >(null);
  const [editStoreOpen, setEditStoreOpen] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [productFilter, setProductFilter] = useState<"all" | "store">("all");
  const [showStorePassId, setShowStorePassId] = useState<number | null>(null);

  // Category management state
  const [productSubTab, setProductSubTab] = useState<"list" | "categories">(
    "list",
  );
  const [customCategories, setCustomCategories] = useState<
    { id: string; label: string; labelHindi: string; emoji: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem("dharma_custom_categories");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newCatForm, setNewCatForm] = useState({
    label: "",
    labelHindi: "",
    emoji: "📦",
  });
  const allCategories = [
    ...CATEGORIES.filter((c) => c.id !== "all"),
    ...customCategories,
  ];

  const saveCustomCategories = (cats: typeof customCategories) => {
    setCustomCategories(cats);
    localStorage.setItem("dharma_custom_categories", JSON.stringify(cats));
  };

  const handleAddCategory = () => {
    if (!newCatForm.label.trim()) return;
    const id = newCatForm.label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (allCategories.some((c) => c.id === id)) {
      toast.error("यह category पहले से है!");
      return;
    }
    saveCustomCategories([
      ...customCategories,
      {
        id,
        label: newCatForm.label.toUpperCase(),
        labelHindi: newCatForm.labelHindi,
        emoji: newCatForm.emoji,
      },
    ]);
    setNewCatForm({ label: "", labelHindi: "", emoji: "📦" });
    toast.success(`Category "${newCatForm.label}" add हो गई!`);
  };

  const handleDeleteCustomCategory = (id: string) => {
    saveCustomCategories(customCategories.filter((c) => c.id !== id));
    toast.success("Category हटा दी गई!");
  };

  const isLoggedIn = identity || passwordUnlocked;

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadOrders = async () => {
      try {
        let raw: string | null = null;
        if (actor) {
          try {
            raw = await (actor as any).getOrdersSnapshot();
          } catch {}
        }
        if (!raw) raw = localStorage.getItem("dharma_orders");
        if (raw) setOrders(JSON.parse(raw));
      } catch {}
    };
    loadOrders();
  }, [isLoggedIn, actor]);

  const handlePasswordLogin = () => {
    if (passwordInput === getClassicAdminPw()) {
      setPasswordUnlocked(true);
      setPasswordError("");
      toast.success("Admin panel unlock हो गई!");
    } else {
      setPasswordError("Password गलत है। दोबारा try करें।");
    }
  };

  const handleAddStore = () => {
    if (!newStore.city || !newStore.address || !newStore.pincode) {
      toast.error("Please fill all required fields.");
      return;
    }
    addStoreCtx({ ...newStore, timings: "9:00 AM – 9:00 PM" });
    toast.success(`Store in ${newStore.city} added successfully!`);
    setNewStore({ city: "", address: "", phone: "", pincode: "" });
    setAddStoreOpen(false);
  };

  const handleDeleteStore = (idx: number) => {
    deleteStoreCtx(stores[idx].id);
    toast.success("Store deleted.");
  };

  const handleEditStoreOpen = (store: SampleStore) => {
    setEditStore({
      city: store.city,
      address: store.address,
      phone: store.phone,
      pincode: store.pincode,
      id: store.id,
    });
    setEditStoreOpen(true);
  };

  const handleEditStoreSave = () => {
    if (!editStore) return;
    if (!editStore.city || !editStore.address || !editStore.pincode) {
      toast.error("City, address और pincode जरूरी हैं।");
      return;
    }
    updateStoreCtx({
      id: editStore.id,
      city: editStore.city,
      address: editStore.address,
      phone: editStore.phone,
      pincode: editStore.pincode,
      timings: "9:00 AM – 9:00 PM",
    });
    toast.success(`Store "${editStore.city}" update हो गई!`);
    setEditStoreOpen(false);
    setEditStore(null);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!actor) {
      deleteProductCtx(productId);
      toast.success("Product deleted.");
      return;
    }
    setDeletingProduct(productId);
    try {
      await actor.deleteProduct(BigInt(productId));
      deleteProductCtx(productId);
      toast.success("Product deleted.");
    } catch {
      deleteProductCtx(productId);
      toast.success("Product deleted.");
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleEditOpen = (product: SampleProduct) => {
    setEditProduct({ ...product });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    if (!editProduct.name || !editProduct.price) {
      toast.error("Product name and price are required.");
      return;
    }
    updateProduct(editProduct);
    toast.success(`"${editProduct.name}" updated successfully!`);
    setEditOpen(false);
    setEditProduct(null);
  };

  const handleAddProductSave = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Product का नाम और price जरूरी हैं।");
      return;
    }
    const product: SampleProduct = {
      id: Date.now(),
      name: newProduct.name,
      nameHindi: newProduct.nameHindi || newProduct.name,
      description: newProduct.description,
      details: newProduct.details || undefined,
      showcase: newProduct.showcase || undefined,
      specifications: newProduct.specifications || undefined,
      warranty: newProduct.warranty || undefined,
      manufacturerInfo: newProduct.manufacturerInfo || undefined,
      colors: newProduct.colors || undefined,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice
        ? Number(newProduct.originalPrice)
        : undefined,
      category: newProduct.category,
      emoji:
        CATEGORIES.find((c) => c.id === newProduct.category)?.emoji ?? "📦",
      isFeatured: newProduct.isFeatured,
      isDeal: newProduct.isDeal,
      isUpcoming: newProduct.isUpcoming,
      stock: Number(newProduct.stock) || 10,
      badge: newProduct.badge || undefined,
      image: newProduct.image || undefined,
      images:
        ([newProduct.image2, newProduct.image3].filter(Boolean) as string[]) ||
        undefined,
    };
    addProduct(product);
    toast.success(`"${product.name}" add हो गया!`);
    setAddProductOpen(false);
    setNewProduct(EMPTY_PRODUCT_FORM);
  };

  if (!isLoggedIn) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-16 text-center"
        data-ocid="admin.login.card"
      >
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-primary mb-2">Admin Login</h2>
        <p className="text-muted-foreground mb-6">
          Admin panel खोलने के लिए password डालें
        </p>

        <div className="bg-card border border-border rounded-xl p-6 mb-4 text-left">
          <h3 className="font-semibold mb-4 text-center">
            Password से Login करें
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative mt-1">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
                  placeholder="Admin password डालें"
                  className={passwordError ? "border-destructive" : ""}
                  data-ocid="admin.login.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="admin.login.error_state"
                >
                  {passwordError}
                </p>
              )}
            </div>
            <Button
              className="w-full bg-primary text-white gap-2"
              onClick={handlePasswordLogin}
              data-ocid="admin.login.submit_button"
            >
              <Lock className="h-4 w-4" /> Admin Panel खोलें
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">— या —</div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          data-ocid="admin.login.primary_button"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" /> Login with Internet Identity
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="admin.page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">
            धर्मा Mart के products और stores manage करें
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-card border border-border rounded px-3 py-1.5">
          {identity
            ? `Logged in: ${identity?.getPrincipal().toString().slice(0, 12)}...`
            : "Password से logged in"}
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-ocid="admin.edit_product.dialog">
          <DialogHeader>
            <DialogTitle>Product Edit करें</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <Label htmlFor="edit-name">Product का नाम *</Label>
                <Input
                  id="edit-name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p ? { ...p, name: e.target.value } : p,
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-hindi">Hindi नाम</Label>
                <Input
                  id="edit-hindi"
                  value={editProduct.nameHindi}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p ? { ...p, nameHindi: e.target.value } : p,
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={editProduct.category}
                  onValueChange={(val) =>
                    setEditProduct((p) => (p ? { ...p, category: val } : p))
                  }
                >
                  <SelectTrigger className="mt-1" id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-price">Price (₹) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, price: Number(e.target.value) } : p,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-original-price">
                    Original Price (₹)
                  </Label>
                  <Input
                    id="edit-original-price"
                    type="number"
                    value={editProduct.originalPrice ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p
                          ? {
                              ...p,
                              originalPrice:
                                Number(e.target.value) || undefined,
                            }
                          : p,
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editProduct.stock}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, stock: Number(e.target.value) } : p,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-badge">Badge</Label>
                  <Input
                    id="edit-badge"
                    value={editProduct.badge ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, badge: e.target.value } : p,
                      )
                    }
                    placeholder="e.g. New, Deal"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p ? { ...p, description: e.target.value } : p,
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <div>
                  <Label htmlFor="edit-details">Product Details / विवरण</Label>
                  <Textarea
                    id="edit-details"
                    value={editProduct.details ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, details: e.target.value } : p,
                      )
                    }
                    placeholder="Product की विशेषताएँ, specifications, size, material आदि..."
                    className="mt-1 resize-none"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-showcase">🖼️ Showcase / विशेषताएँ</Label>
                  <Textarea
                    id="edit-showcase"
                    value={editProduct.showcase ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, showcase: e.target.value || undefined } : p,
                      )
                    }
                    placeholder={"हर लाइन में एक highlight लिखें"}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-specifications">
                    ⚙️ Specifications / विशिष्टताएँ
                  </Label>
                  <Textarea
                    id="edit-specifications"
                    value={editProduct.specifications ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p
                          ? {
                              ...p,
                              specifications: e.target.value || undefined,
                            }
                          : p,
                      )
                    }
                    placeholder={"Key: Value format में लिखें"}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-warranty">🛡️ Warranty / वारंटी</Label>
                  <Input
                    id="edit-warranty"
                    value={editProduct.warranty ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, warranty: e.target.value || undefined } : p,
                      )
                    }
                    placeholder="जैसे: 1 साल की manufacturer warranty"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-manufacturer">
                    🏭 Manufacturer Info / निर्माता जानकारी
                  </Label>
                  <Textarea
                    id="edit-manufacturer"
                    value={editProduct.manufacturerInfo ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p
                          ? {
                              ...p,
                              manufacturerInfo: e.target.value || undefined,
                            }
                          : p,
                      )
                    }
                    placeholder="Brand name, address, contact"
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-colors">
                    🎨 Color Options / रंग विकल्प
                  </Label>
                  <Input
                    id="edit-colors"
                    value={editProduct.colors ?? ""}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, colors: e.target.value || undefined } : p,
                      )
                    }
                    placeholder="जैसे: Red, Blue, Black, White"
                    className="mt-1"
                  />
                </div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editProduct.image ?? ""}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p ? { ...p, image: e.target.value || undefined } : p,
                    )
                  }
                  placeholder="https://... या /assets/generated/..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-image2">Additional Image 2 URL</Label>
                <Input
                  id="edit-image2"
                  value={editProduct.images?.[0] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditProduct((p) => {
                      if (!p) return p;
                      const imgs = [...(p.images ?? [])];
                      imgs[0] = val;
                      return { ...p, images: imgs.filter(Boolean) };
                    });
                  }}
                  placeholder="https://... या /assets/generated/..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-image3">Additional Image 3 URL</Label>
                <Input
                  id="edit-image3"
                  value={editProduct.images?.[1] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditProduct((p) => {
                      if (!p) return p;
                      const imgs = [...(p.images ?? [])];
                      imgs[1] = val;
                      return { ...p, images: imgs.filter(Boolean) };
                    });
                  }}
                  placeholder="https://... या /assets/generated/..."
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProduct.isFeatured}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, isFeatured: e.target.checked } : p,
                      )
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProduct.isDeal}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, isDeal: e.target.checked } : p,
                      )
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">Deal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProduct.isUpcoming ?? false}
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, isUpcoming: e.target.checked } : p,
                      )
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">Upcoming</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-primary text-white gap-2"
                  onClick={handleEditSave}
                  data-ocid="admin.edit_product.save_button"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditOpen(false);
                    setEditProduct(null);
                  }}
                  data-ocid="admin.edit_product.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent data-ocid="admin.add_product.dialog">
          <DialogHeader>
            <DialogTitle>नया Product जोड़ें</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <Label htmlFor="add-name">Product का नाम *</Label>
              <Input
                id="add-name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Samsung Galaxy S24"
                className="mt-1"
                data-ocid="admin.add_product.input"
              />
            </div>
            <div>
              <Label htmlFor="add-hindi">Hindi नाम</Label>
              <Input
                id="add-hindi"
                value={newProduct.nameHindi}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, nameHindi: e.target.value }))
                }
                placeholder="e.g. सैमसंग गैलेक्सी"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-category">Category *</Label>
              <Select
                value={newProduct.category}
                onValueChange={(val) =>
                  setNewProduct((p) => ({ ...p, category: val }))
                }
              >
                <SelectTrigger
                  className="mt-1"
                  id="add-category"
                  data-ocid="admin.add_product.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="add-price">Price (₹) *</Label>
                <Input
                  id="add-price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="999"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="add-original-price">Original Price (₹)</Label>
                <Input
                  id="add-original-price"
                  type="number"
                  value={newProduct.originalPrice}
                  onChange={(e) =>
                    setNewProduct((p) => ({
                      ...p,
                      originalPrice: e.target.value,
                    }))
                  }
                  placeholder="1299"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="add-stock">Stock</Label>
                <Input
                  id="add-stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, stock: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="add-badge">Badge</Label>
                <Input
                  id="add-badge"
                  value={newProduct.badge}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, badge: e.target.value }))
                  }
                  placeholder="e.g. New, Sale"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-desc">Description</Label>
              <Textarea
                id="add-desc"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Product description..."
                className="mt-1 resize-none"
                rows={3}
                data-ocid="admin.add_product.textarea"
              />
            </div>
            <div>
              <Label htmlFor="add-details">Product Details / विवरण</Label>
              <Textarea
                id="add-details"
                value={newProduct.details}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, details: e.target.value }))
                }
                placeholder="Product की विशेषताएँ, specifications, size, material, brand info आदि..."
                className="mt-1 resize-none"
                rows={4}
                data-ocid="admin.add_product.details.textarea"
              />
            </div>
            <div>
              <Label htmlFor="add-showcase">🖼️ Showcase / विशेषताएँ</Label>
              <Textarea
                id="add-showcase"
                value={newProduct.showcase}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, showcase: e.target.value }))
                }
                placeholder={
                  "हर लाइन में एक highlight लिखें\nजैसे: 5000mAh Battery\n6GB RAM"
                }
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="add-specifications">
                ⚙️ Specifications / विशिष्टताएँ
              </Label>
              <Textarea
                id="add-specifications"
                value={newProduct.specifications}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
                    specifications: e.target.value,
                  }))
                }
                placeholder={
                  "Key: Value format में लिखें\nजैसे: Battery: 5000mAh\nRAM: 6GB"
                }
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="add-warranty">🛡️ Warranty / वारंटी</Label>
              <Input
                id="add-warranty"
                value={newProduct.warranty}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, warranty: e.target.value }))
                }
                placeholder="जैसे: 1 साल की manufacturer warranty"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-manufacturer">
                🏭 Manufacturer Info / निर्माता जानकारी
              </Label>
              <Textarea
                id="add-manufacturer"
                value={newProduct.manufacturerInfo}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
                    manufacturerInfo: e.target.value,
                  }))
                }
                placeholder="Brand name, address, contact, country of origin"
                className="mt-1 resize-none"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="add-colors">🎨 Color Options / रंग विकल्प</Label>
              <Input
                id="add-colors"
                value={newProduct.colors}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, colors: e.target.value }))
                }
                placeholder="जैसे: Red, Blue, Black, White"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-image">Image URL (optional)</Label>
              <Input
                id="add-image"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://... या /assets/generated/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-image2">Additional Image 2 URL</Label>
              <Input
                id="add-image2"
                value={newProduct.image2}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, image2: e.target.value }))
                }
                placeholder="https://... या /assets/generated/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-image3">Additional Image 3 URL</Label>
              <Input
                id="add-image3"
                value={newProduct.image3}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, image3: e.target.value }))
                }
                placeholder="https://... या /assets/generated/..."
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="add-featured"
                  checked={newProduct.isFeatured}
                  onCheckedChange={(v) =>
                    setNewProduct((p) => ({ ...p, isFeatured: !!v }))
                  }
                  data-ocid="admin.add_product.checkbox"
                />
                <Label htmlFor="add-featured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="add-deal"
                  checked={newProduct.isDeal}
                  onCheckedChange={(v) =>
                    setNewProduct((p) => ({ ...p, isDeal: !!v }))
                  }
                />
                <Label htmlFor="add-deal" className="cursor-pointer">
                  Deal
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="add-upcoming"
                  checked={newProduct.isUpcoming}
                  onCheckedChange={(v) =>
                    setNewProduct((p) => ({ ...p, isUpcoming: !!v }))
                  }
                  data-ocid="admin.add_product.upcoming.checkbox"
                />
                <Label htmlFor="add-upcoming" className="cursor-pointer">
                  Upcoming Product
                </Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-primary text-white gap-2"
                onClick={handleAddProductSave}
                data-ocid="admin.add_product.submit_button"
              >
                <Plus className="h-4 w-4" /> Product जोड़ें
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAddProductOpen(false);
                  setNewProduct(EMPTY_PRODUCT_FORM);
                }}
                data-ocid="admin.add_product.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={editStoreOpen} onOpenChange={setEditStoreOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Store Edit करें</DialogTitle>
          </DialogHeader>
          {editStore && (
            <div className="space-y-4 mt-2">
              <div>
                <Label>City / शहर का नाम *</Label>
                <Input
                  value={editStore.city}
                  onChange={(e) =>
                    setEditStore((s) =>
                      s ? { ...s, city: e.target.value } : s,
                    )
                  }
                  className="mt-1"
                  placeholder="e.g. Delhi"
                />
              </div>
              <div>
                <Label>Address / पता *</Label>
                <Input
                  value={editStore.address}
                  onChange={(e) =>
                    setEditStore((s) =>
                      s ? { ...s, address: e.target.value } : s,
                    )
                  }
                  className="mt-1"
                  placeholder="Full store address"
                />
              </div>
              <div>
                <Label>Phone / संपर्क नंबर</Label>
                <Input
                  value={editStore.phone}
                  onChange={(e) =>
                    setEditStore((s) =>
                      s ? { ...s, phone: e.target.value } : s,
                    )
                  }
                  className="mt-1"
                  placeholder="Contact number"
                />
              </div>
              <div>
                <Label>PIN Code *</Label>
                <Input
                  value={editStore.pincode}
                  onChange={(e) =>
                    setEditStore((s) =>
                      s ? { ...s, pincode: e.target.value } : s,
                    )
                  }
                  className="mt-1"
                  placeholder="6-digit PIN code"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-primary text-white gap-2"
                  onClick={handleEditStoreSave}
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditStoreOpen(false);
                    setEditStore(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="products" data-ocid="admin.tabs">
        <TabsList className="mb-6">
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" /> Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="stores" className="gap-2">
            <MapPin className="h-4 w-4" /> Stores ({stores?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="h-4 w-4" /> Customers / ग्राहक (
            {allCustomers.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart2 className="h-4 w-4" /> Analytics / विश्लेषण
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            ⭐ Reviews / समीक्षाएं
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {/* Sub-tab navigation */}
          <div className="flex gap-2 mb-4 border-b border-border pb-2">
            <button
              type="button"
              onClick={() => setProductSubTab("list")}
              className={
                productSubTab === "list"
                  ? "px-4 py-1.5 rounded-t text-sm font-semibold bg-primary text-white"
                  : "px-4 py-1.5 rounded-t text-sm font-medium bg-secondary text-muted-foreground hover:bg-primary/10"
              }
            >
              📦 Products ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setProductSubTab("categories")}
              className={
                productSubTab === "categories"
                  ? "px-4 py-1.5 rounded-t text-sm font-semibold bg-primary text-white"
                  : "px-4 py-1.5 rounded-t text-sm font-medium bg-secondary text-muted-foreground hover:bg-primary/10"
              }
            >
              🏷️ Categories / श्रेणियाँ ({allCategories.length})
            </button>
          </div>

          {productSubTab === "categories" && (
            <div className="space-y-6">
              {/* Add new category form */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-sm">
                  ➕ नई Category जोड़ें
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">English Name *</Label>
                    <Input
                      placeholder="e.g. Toys"
                      value={newCatForm.label}
                      onChange={(e) =>
                        setNewCatForm((p) => ({ ...p, label: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Hindi Name</Label>
                    <Input
                      placeholder="e.g. खिलौने"
                      value={newCatForm.labelHindi}
                      onChange={(e) =>
                        setNewCatForm((p) => ({
                          ...p,
                          labelHindi: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Emoji</Label>
                    <Input
                      placeholder="🧸"
                      value={newCatForm.emoji}
                      onChange={(e) =>
                        setNewCatForm((p) => ({ ...p, emoji: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="w-full bg-primary text-white gap-2"
                      onClick={handleAddCategory}
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Built-in categories */}
              <div>
                <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                  Default Categories (हटाए नहीं जा सकते)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 text-sm"
                    >
                      <span>{cat.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">
                          {cat.label}
                        </p>
                        {cat.labelHindi && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {cat.labelHindi}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom categories */}
              {customCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                    Custom Categories (आपने जोड़ी हैं)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {customCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 text-sm"
                      >
                        <span>{cat.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs truncate">
                            {cat.label}
                          </p>
                          {cat.labelHindi && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {cat.labelHindi}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomCategory(cat.id)}
                          className="text-destructive hover:text-destructive/80 flex-shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {productSubTab === "list" && (
            <>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProductFilter("all")}
                    className={
                      productFilter === "all"
                        ? "px-3 py-1 rounded-full text-sm font-medium bg-primary text-white"
                        : "px-3 py-1 rounded-full text-sm font-medium bg-secondary text-muted-foreground hover:bg-primary/10"
                    }
                    data-ocid="admin.products.tab"
                  >
                    सभी Products ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductFilter("store")}
                    className={
                      productFilter === "store"
                        ? "px-3 py-1 rounded-full text-sm font-medium bg-accent text-white"
                        : "px-3 py-1 rounded-full text-sm font-medium bg-secondary text-muted-foreground hover:bg-accent/10"
                    }
                    data-ocid="admin.products.tab"
                  >
                    🏪 Store Submitted (
                    {products.filter((p) => p.storeSubmitted).length})
                  </button>
                </div>
                <Button
                  className="bg-primary text-white gap-2"
                  data-ocid="admin.add_product.open_modal_button"
                  onClick={() => setAddProductOpen(true)}
                >
                  <Plus className="h-4 w-4" /> नया Product जोड़ें
                </Button>
              </div>

              <div className="space-y-3">
                {products
                  .filter((p) => productFilter === "all" || p.storeSubmitted)
                  .map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                      data-ocid={`admin.products.item.${idx + 1}`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{product.emoji}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-primary">
                            {
                              CATEGORIES.find((c) => c.id === product.category)
                                ?.emoji
                            }{" "}
                            {CATEGORIES.find((c) => c.id === product.category)
                              ?.label ?? product.category}
                          </span>
                          {" · "}₹{product.price.toLocaleString("en-IN")}
                          {product.originalPrice && (
                            <span className="line-through ml-1 opacity-60">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {product.isFeatured && (
                            <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-semibold">
                              Featured
                            </span>
                          )}
                          {product.isDeal && (
                            <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-semibold">
                              Deal
                            </span>
                          )}
                          {product.badge && (
                            <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                              {product.badge}
                            </span>
                          )}
                          {product.stock === 0 ? (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">
                              🔴 Out of Stock
                            </span>
                          ) : product.stock < 5 ? (
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
                              ⚠️ Low Stock ({product.stock})
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-white h-8"
                          onClick={() => handleEditOpen(product)}
                          data-ocid={`admin.products.edit_button.${idx + 1}`}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white h-8"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingProduct === product.id}
                          data-ocid={`admin.products.delete_button.${idx + 1}`}
                        >
                          {deletingProduct === product.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="stores">
          <div className="flex justify-end mb-4">
            <Dialog open={addStoreOpen} onOpenChange={setAddStoreOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary text-white gap-2"
                  data-ocid="admin.add_store.open_modal_button"
                >
                  <Plus className="h-4 w-4" /> Add New Store
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Store Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g. Jaipur"
                      value={newStore.city}
                      onChange={(e) =>
                        setNewStore((s) => ({ ...s, city: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Full store address"
                      value={newStore.address}
                      onChange={(e) =>
                        setNewStore((s) => ({ ...s, address: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit PIN code"
                      value={newStore.pincode}
                      onChange={(e) =>
                        setNewStore((s) => ({ ...s, pincode: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone / संपर्क नंबर</Label>
                    <Input
                      id="phone"
                      placeholder="Contact number"
                      value={newStore.phone}
                      onChange={(e) =>
                        setNewStore((s) => ({ ...s, phone: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 bg-primary text-white"
                      onClick={handleAddStore}
                    >
                      Add Store
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAddStoreOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingStores ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !stores || stores.length === 0 ? (
            <div
              className="text-center py-12"
              data-ocid="admin.stores.empty_state"
            >
              <div className="text-4xl mb-3">🏪</div>
              <p className="text-muted-foreground">
                No stores added yet. Click "Add New Store" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map((store, idx) => (
                <div
                  key={`${store.city}-${store.pincode}`}
                  className="bg-card border border-border rounded-lg p-4"
                  data-ocid={`admin.stores.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {store.name || store.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {store.address} · PIN: {store.pincode}
                      </p>
                      {store.phone && (
                        <p className="text-xs text-muted-foreground">
                          📞 {store.phone}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          Password:
                        </span>
                        <code className="text-xs bg-muted px-1 rounded">
                          {showStorePassId === store.id
                            ? store.password || "store@123"
                            : "••••••••"}
                        </code>
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                          onClick={() =>
                            setShowStorePassId(
                              showStorePassId === store.id ? null : store.id,
                            )
                          }
                        >
                          {showStorePassId === store.id ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          className="text-xs text-accent hover:underline"
                          onClick={() => {
                            const url = `${window.location.origin}/store-login`;
                            navigator.clipboard
                              .writeText(url)
                              .then(() => {
                                toast.success("Store Login link copied!");
                              })
                              .catch(() => {
                                toast.error("Copy failed");
                              });
                          }}
                          data-ocid={`admin.stores.secondary_button.${idx + 1}`}
                        >
                          🔗 Store Login Link Copy
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => handleEditStoreOpen(store)}
                        data-ocid={`admin.stores.edit_button.${idx + 1}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => handleDeleteStore(idx)}
                        data-ocid={`admin.stores.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="customers">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg px-4 py-2 text-sm font-semibold text-primary">
              कुल ग्राहक: {allCustomers.length}
            </div>
          </div>
          {allCustomers.length === 0 ? (
            <div
              className="text-center py-12"
              data-ocid="admin.customers.empty_state"
            >
              <div className="text-4xl mb-3">👤</div>
              <p className="text-muted-foreground">
                अभी कोई ग्राहक नहीं है। जब customers login करेंगे, यहाँ दिखेंगे।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allCustomers.map((cust: Customer, idx: number) => {
                const wl = getWishlist(cust.id);
                const isExpanded = expandedCustomer === cust.id;
                return (
                  <motion.div
                    key={cust.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-card border border-border rounded-lg overflow-hidden"
                    data-ocid={`admin.customers.item.${idx + 1}`}
                  >
                    <button
                      type="button"
                      className="p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30 transition-colors w-full text-left"
                      onClick={() =>
                        setExpandedCustomer(isExpanded ? null : cust.id)
                      }
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{cust.name}</p>
                        <p className="text-xs text-muted-foreground">
                          📞 {cust.mobile} · 🏙️ {cust.city}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          📍 {cust.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                          ❤️ {wl.length} wishlist
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(cust.registeredAt).toLocaleDateString(
                            "hi-IN",
                          )}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer(cust.id);
                            toast.success("Customer हटाया गया");
                          }}
                          data-ocid={`admin.customers.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </button>
                    {isExpanded && wl.length > 0 && (
                      <div className="border-t border-border bg-secondary/20 px-4 py-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Wishlist Items:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {wl.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 bg-card rounded-lg p-2 border border-border"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-primary font-bold">
                                  ₹{item.price.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {isExpanded && wl.length === 0 && (
                      <div className="border-t border-border bg-secondary/20 px-4 py-3 text-center text-sm text-muted-foreground">
                        इस customer की wishlist खाली है
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {(() => {
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce(
              (s: number, o: any) => s + (o.total || 0),
              0,
            );
            const statusCounts: Record<string, number> = {};
            for (const o of orders) {
              const st = o.status || "Placed";
              statusCounts[st] = (statusCounts[st] || 0) + 1;
            }
            const productFreq: Record<string, number> = {};
            for (const o of orders) {
              for (const item of o.items || []) {
                productFreq[item.name] =
                  (productFreq[item.name] || 0) + item.quantity;
              }
            }
            const top5 = Object.entries(productFreq)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);
            const maxFreq = top5[0]?.[1] || 1;

            return (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Orders",
                      value: totalOrders,
                      icon: "📦",
                      color: "bg-blue-50 text-blue-700",
                    },
                    {
                      label: "Total Revenue",
                      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
                      icon: "💰",
                      color: "bg-green-50 text-green-700",
                    },
                    {
                      label: "Total Customers",
                      value: allCustomers.length,
                      icon: "👥",
                      color: "bg-purple-50 text-purple-700",
                    },
                    {
                      label: "Total Products",
                      value: products.length,
                      icon: "🛍️",
                      color: "bg-orange-50 text-orange-700",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-xl p-4 ${stat.color} border border-current/10`}
                      data-ocid={`admin.analytics.${stat.label.toLowerCase().replace(/ /g, "_")}.card`}
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs font-medium mt-0.5 opacity-80">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Products */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Top 5 Products by
                      Orders
                    </h3>
                    {top5.length === 0 ? (
                      <p
                        className="text-muted-foreground text-sm text-center py-6"
                        data-ocid="admin.analytics.products.empty_state"
                      >
                        No order data yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {top5.map(([name, count], i) => (
                          <div
                            key={name}
                            data-ocid={`admin.analytics.product.item.${i + 1}`}
                          >
                            <div className="flex justify-between text-sm mb-1">
                              <span className="truncate font-medium">
                                {name}
                              </span>
                              <span className="text-muted-foreground flex-shrink-0 ml-2">
                                {count} sold
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(count / maxFreq) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Orders by Status */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" /> Orders by Status
                    </h3>
                    {totalOrders === 0 ? (
                      <p
                        className="text-muted-foreground text-sm text-center py-6"
                        data-ocid="admin.analytics.orders.empty_state"
                      >
                        No orders yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {[
                          { label: "Placed", color: "bg-blue-500" },
                          { label: "Processing", color: "bg-yellow-500" },
                          { label: "Shipped", color: "bg-orange-500" },
                          { label: "Delivered", color: "bg-green-500" },
                        ].map((s) => {
                          const count = statusCounts[s.label] || 0;
                          const pct =
                            totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                          return (
                            <div key={s.label}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{s.label}</span>
                                <span className="text-muted-foreground">
                                  {count} ({Math.round(pct)}%)
                                </span>
                              </div>
                              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${s.color}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReviewsManagement() {
  const [reviews, setReviews] = useState<
    Record<
      string,
      Array<{
        id: string;
        productId?: string;
        productName?: string;
        customerName: string;
        rating: number;
        text: string;
        approved?: boolean;
        date: string;
      }>
    >
  >({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dharma_reviews");
      if (raw) setReviews(JSON.parse(raw));
    } catch {}
  }, []);

  const allReviews = Object.entries(reviews).flatMap(([slug, arr]) =>
    arr.map((r) => ({ ...r, slug })),
  );

  const approveReview = (slug: string, id: string) => {
    const updated = { ...reviews };
    updated[slug] = (updated[slug] || []).map((r) =>
      r.id === id ? { ...r, approved: true } : r,
    );
    setReviews(updated);
    localStorage.setItem("dharma_reviews", JSON.stringify(updated));
  };

  const deleteReview = (slug: string, id: string) => {
    const updated = { ...reviews };
    updated[slug] = (updated[slug] || []).filter((r) => r.id !== id);
    setReviews(updated);
    localStorage.setItem("dharma_reviews", JSON.stringify(updated));
  };

  if (allReviews.length === 0) {
    return (
      <div
        className="text-center py-12 text-muted-foreground"
        data-ocid="admin.reviews.empty_state"
      >
        <div className="text-4xl mb-3">⭐</div>
        <p>अभी कोई review नहीं है।</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="admin.reviews.table">
      <p className="text-sm text-muted-foreground">
        {allReviews.length} total reviews
      </p>
      {allReviews.map((review, idx) => (
        <div
          key={review.id}
          className="bg-card border border-border rounded-lg p-4 flex items-start gap-4"
          data-ocid={`admin.reviews.item.${idx + 1}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-sm">
                {review.customerName}
              </span>
              <span className="text-xs text-muted-foreground">
                on{" "}
                <span className="text-primary font-medium">{review.slug}</span>
              </span>
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={
                      s <= review.rating
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }
                  >
                    ★
                  </span>
                ))}
              </span>
              {review.approved ? (
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">
                  ✅ Approved
                </span>
              ) : (
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-semibold">
                  ⏳ Pending
                </span>
              )}
            </div>
            <p className="text-sm text-foreground/80">{review.text}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(review.date).toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {!review.approved && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                onClick={() => approveReview(review.slug, review.id)}
                data-ocid={`admin.reviews.approve_button.${idx + 1}`}
              >
                ✅ Approve
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-white h-8 text-xs"
              onClick={() => deleteReview(review.slug, review.id)}
              data-ocid={`admin.reviews.delete_button.${idx + 1}`}
            >
              🗑️ Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
