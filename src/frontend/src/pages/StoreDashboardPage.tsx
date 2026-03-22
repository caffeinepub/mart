import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/context/ProductsContext";
import { useStores } from "@/context/StoresContext";
import { CATEGORIES, type SampleProduct } from "@/data/sampleData";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Edit, LogOut, Package, Plus, Store, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  nameHindi: "",
  price: "",
  originalPrice: "",
  category: "",
  description: "",
  image: "",
  stock: "10",
};

export function StoreDashboardPage() {
  const search = useSearch({ strict: false }) as { storeId?: string };
  const storeId = Number(search.storeId);
  const { stores } = useStores();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const store = stores.find((s) => s.id === storeId);

  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState<SampleProduct | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("my-products");

  if (!storeId || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-lg text-muted-foreground">
          Store not found. कृपया login करें।
        </p>
        <Link to="/store-login" className="text-primary hover:underline">
          Store Login पर जाएं
        </Link>
      </div>
    );
  }

  const storeProducts = products.filter((p) => p.storeId === storeId);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Product का नाम, price, और category जरूरी है।");
      return;
    }
    const productData: SampleProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: form.name,
      nameHindi: form.nameHindi || undefined,
      price: Number(form.price),
      originalPrice: form.originalPrice
        ? Number(form.originalPrice)
        : undefined,
      category: form.category,
      description: form.description || undefined,
      image: form.image || undefined,
      stock: Number(form.stock) || 10,
      isDeal: false,
      storeId: storeId,
      storeName: store.name || store.city,
      storeSubmitted: true,
    };
    if (editingProduct) {
      updateProduct(productData);
      toast.success("Product update हो गया!");
    } else {
      addProduct(productData);
      toast.success("Product add हो गया! Admin approval के बाद live होगा।");
    }
    resetForm();
    setActiveTab("my-products");
  };

  const handleEdit = (product: SampleProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      nameHindi: product.nameHindi || "",
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      category: product.category,
      description: product.description || "",
      image: product.image || "",
      stock: String(product.stock),
    });
    setActiveTab("add-product");
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    toast.success("Product delete हो गया।");
  };

  const handleLogout = () => {
    navigate({ to: "/store-login" });
  };

  const productCategories = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="min-h-screen bg-secondary/10">
      {/* Store Header */}
      <div className="bg-primary text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">
                {store.name || store.city}
              </p>
              <p className="text-white/70 text-sm">
                {store.city} · {store.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-white/80 hover:text-white text-sm hidden sm:block"
            >
              🪔 धर्मा Mart
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
              onClick={handleLogout}
              data-ocid="store_dashboard.button"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-primary">
                {storeProducts.length}
              </p>
              <p className="text-sm text-muted-foreground">कुल Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-600">
                {storeProducts.filter((p) => p.stock > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-accent">
                {storeProducts.length > 0
                  ? `₹${Math.min(...storeProducts.map((p) => p.price))}`
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">Min Price</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-primary/10">
            <TabsTrigger
              value="my-products"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="store_dashboard.tab"
            >
              <Package className="h-4 w-4" />
              My Products / मेरे उत्पाद ({storeProducts.length})
            </TabsTrigger>
            <TabsTrigger
              value="add-product"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="store_dashboard.tab"
            >
              <Plus className="h-4 w-4" />
              {editingProduct ? "Edit Product" : "Add Product / उत्पाद जोड़ें"}
            </TabsTrigger>
          </TabsList>

          {/* My Products Tab */}
          <TabsContent value="my-products">
            {storeProducts.length === 0 ? (
              <div
                className="text-center py-16 bg-card rounded-xl border border-dashed border-border"
                data-ocid="store_dashboard.empty_state"
              >
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-lg">अभी कोई product नहीं है</p>
                <p className="text-muted-foreground text-sm mt-1">
                  "Add Product" tab से अपना पहला product add करें
                </p>
                <Button
                  className="mt-4 bg-primary text-white"
                  onClick={() => setActiveTab("add-product")}
                  data-ocid="store_dashboard.primary_button"
                >
                  <Plus className="h-4 w-4 mr-2" /> Product जोड़ें
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {storeProducts.map((product, idx) => (
                  <Card
                    key={product.id}
                    data-ocid={`store_dashboard.item.${idx + 1}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{product.name}</p>
                        {product.nameHindi && (
                          <p className="text-sm text-muted-foreground">
                            {product.nameHindi}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-primary font-bold">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through text-sm">
                              ₹{product.originalPrice}
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              product.stock > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.stock > 0
                              ? `Stock: ${product.stock}`
                              : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                          onClick={() => handleEdit(product)}
                          data-ocid={`store_dashboard.edit_button.${idx + 1}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => handleDelete(product.id)}
                          data-ocid={`store_dashboard.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Add / Edit Product Tab */}
          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  {editingProduct ? "✏️ Product Edit करें" : "➕ नया Product जोड़ें"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="p-name">Product Name *</Label>
                    <Input
                      id="p-name"
                      placeholder="e.g. Basmati Rice 1kg"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      data-ocid="store_dashboard.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-name-hindi">Hindi Name / हिंदी नाम</Label>
                    <Input
                      id="p-name-hindi"
                      placeholder="e.g. बासमती चावल"
                      value={form.nameHindi}
                      onChange={(e) =>
                        setForm({ ...form, nameHindi: e.target.value })
                      }
                      data-ocid="store_dashboard.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-price">Price (₹) *</Label>
                    <Input
                      id="p-price"
                      type="number"
                      placeholder="e.g. 299"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      data-ocid="store_dashboard.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-original-price">Original Price (₹)</Label>
                    <Input
                      id="p-original-price"
                      type="number"
                      placeholder="MRP / Original price"
                      value={form.originalPrice}
                      onChange={(e) =>
                        setForm({ ...form, originalPrice: e.target.value })
                      }
                      data-ocid="store_dashboard.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-category">Category *</Label>
                    <select
                      id="p-category"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      data-ocid="store_dashboard.select"
                    >
                      <option value="">-- Category चुनें --</option>
                      {productCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.label} / {c.labelHindi}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-stock">Stock / स्टॉक</Label>
                    <Input
                      id="p-stock"
                      type="number"
                      placeholder="10"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      data-ocid="store_dashboard.input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-image">Image URL</Label>
                  <Input
                    id="p-image"
                    placeholder="https://... product image URL"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    data-ocid="store_dashboard.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-description">Description / विवरण</Label>
                  <Textarea
                    id="p-description"
                    placeholder="Product के बारे में बताएं..."
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    data-ocid="store_dashboard.textarea"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    onClick={handleSubmit}
                    data-ocid="store_dashboard.submit_button"
                  >
                    {editingProduct ? "Update करें" : "Product जोड़ें"}
                  </Button>
                  {editingProduct && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      data-ocid="store_dashboard.cancel_button"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
