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
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "dharma@admin123";

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
  image: string;
  isFeatured: boolean;
  isDeal: boolean;
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
  image: "",
  isFeatured: false,
  isDeal: false,
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

  const isLoggedIn = identity || passwordUnlocked;

  const handlePasswordLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
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
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice
        ? Number(newProduct.originalPrice)
        : undefined,
      category: newProduct.category,
      emoji:
        CATEGORIES.find((c) => c.id === newProduct.category)?.emoji ?? "📦",
      isFeatured: newProduct.isFeatured,
      isDeal: newProduct.isDeal,
      stock: Number(newProduct.stock) || 10,
      badge: newProduct.badge || undefined,
      image: newProduct.image || undefined,
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
        </TabsList>

        <TabsContent value="products">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-primary text-white gap-2"
              data-ocid="admin.add_product.open_modal_button"
              onClick={() => setAddProductOpen(true)}
            >
              <Plus className="h-4 w-4" /> नया Product जोड़ें
            </Button>
          </div>

          <div className="space-y-3">
            {products.map((product, idx) => (
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
                      {CATEGORIES.find((c) => c.id === product.category)?.emoji}{" "}
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
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                  data-ocid={`admin.stores.item.${idx + 1}`}
                >
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">{store.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {store.address} · PIN: {store.pincode}
                    </p>
                    {store.phone && (
                      <p className="text-xs text-muted-foreground">
                        📞 {store.phone}
                      </p>
                    )}
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
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
