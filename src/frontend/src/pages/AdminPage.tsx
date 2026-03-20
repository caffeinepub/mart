import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORIES,
  SAMPLE_PRODUCTS,
  type SampleProduct,
} from "@/data/sampleData";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAddStore, useAllStores, useDeleteStore } from "@/hooks/useQueries";
import {
  Edit,
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

interface NewStore {
  city: string;
  address: string;
  phone: string;
  pincode: string;
}

export function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: stores, isLoading: loadingStores } = useAllStores();
  const addStoreMutation = useAddStore();
  const deleteStoreMutation = useDeleteStore();
  const { actor } = useActor();

  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [newStore, setNewStore] = useState<NewStore>({
    city: "",
    address: "",
    phone: "",
    pincode: "",
  });

  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);
  const [products, setProducts] = useState<SampleProduct[]>(SAMPLE_PRODUCTS);
  const [editProduct, setEditProduct] = useState<SampleProduct | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleAddStore = async () => {
    if (!newStore.city || !newStore.address || !newStore.pincode) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      await addStoreMutation.mutateAsync(newStore);
      toast.success(`Store in ${newStore.city} added successfully!`);
      setNewStore({ city: "", address: "", phone: "", pincode: "" });
      setAddStoreOpen(false);
    } catch {
      toast.error("Failed to add store.");
    }
  };

  const handleDeleteStore = async (idx: number) => {
    try {
      await deleteStoreMutation.mutateAsync(BigInt(idx));
      toast.success("Store deleted.");
    } catch {
      toast.error("Failed to delete store.");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!actor) return;
    setDeletingProduct(productId);
    try {
      await actor.deleteProduct(BigInt(productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
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
    setProducts((prev) =>
      prev.map((p) => (p.id === editProduct.id ? editProduct : p)),
    );
    toast.success(`"${editProduct.name}" updated successfully!`);
    setEditOpen(false);
    setEditProduct(null);
  };

  if (!identity) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="admin.login.card"
      >
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Admin Login Required
        </h2>
        <p className="text-muted-foreground mb-2">
          Admin panel use करने के लिए पहले login करें।
        </p>
        <p className="text-sm text-muted-foreground mb-6 bg-secondary/50 rounded-lg p-3">
          <strong>Internet Identity</strong> एक secure digital login है।
          <br />
          नीचे button दबाएं, एक popup खुलेगा — वहाँ <strong>"Create New"</strong> या
          अपना existing ID डालें।
        </p>
        <Button
          className="bg-primary text-white px-8"
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
          Logged in: {identity?.getPrincipal().toString().slice(0, 12)}...
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-ocid="admin.edit_product.dialog">
          <DialogHeader>
            <DialogTitle>Product Edit करें</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4 mt-2">
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
                  data-ocid="admin.edit_product.name_input"
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
                  data-ocid="admin.edit_product.hindi_name_input"
                />
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
                    data-ocid="admin.edit_product.price_input"
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
                    data-ocid="admin.edit_product.original_price_input"
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
                    data-ocid="admin.edit_product.stock_input"
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
                    data-ocid="admin.edit_product.badge_input"
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
                  data-ocid="admin.edit_product.description_input"
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

      <Tabs defaultValue="products" data-ocid="admin.tabs">
        <TabsList className="mb-6">
          <TabsTrigger
            value="products"
            className="gap-2"
            data-ocid="admin.products.tab"
          >
            <Package className="h-4 w-4" /> Products ({products.length})
          </TabsTrigger>
          <TabsTrigger
            value="stores"
            className="gap-2"
            data-ocid="admin.stores.tab"
          >
            <MapPin className="h-4 w-4" /> Stores ({stores?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="space-y-3">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                data-ocid={`admin.product.item.${idx + 1}`}
              >
                {/* Thumbnail */}
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
                    {CATEGORIES.find((c) => c.id === product.category)?.label ??
                      product.category}{" "}
                    · ₹{product.price.toLocaleString("en-IN")}
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
                    data-ocid={`admin.product.edit_button.${idx + 1}`}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white h-8"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deletingProduct === product.id}
                    data-ocid={`admin.product.delete_button.${idx + 1}`}
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

        {/* Stores Tab */}
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
              <DialogContent data-ocid="admin.add_store.dialog">
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
                      data-ocid="admin.store_city.input"
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
                      data-ocid="admin.store_address.input"
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
                      data-ocid="admin.store_pincode.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Contact number"
                      value={newStore.phone}
                      onChange={(e) =>
                        setNewStore((s) => ({ ...s, phone: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="admin.store_phone.input"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 bg-primary text-white"
                      onClick={handleAddStore}
                      disabled={addStoreMutation.isPending}
                      data-ocid="admin.add_store.confirm_button"
                    >
                      {addStoreMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Add Store"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAddStoreOpen(false)}
                      data-ocid="admin.add_store.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingStores ? (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="admin.stores.loading_state"
            >
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
                  data-ocid={`admin.store.item.${idx + 1}`}
                >
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">{store.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {store.address} · PIN: {store.pincode}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => handleDeleteStore(idx)}
                    disabled={deleteStoreMutation.isPending}
                    data-ocid={`admin.store.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
