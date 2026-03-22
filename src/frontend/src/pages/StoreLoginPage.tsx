import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useStores } from "@/context/StoresContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function StoreLoginPage() {
  const { stores } = useStores();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!selectedCity) {
      setError("कृपया अपना स्टोर चुनें");
      return;
    }
    const store = stores.find((s) => s.city === selectedCity);
    if (!store) {
      setError("Store not found");
      return;
    }
    const storePass =
      localStorage.getItem(`dharma_store_pw_${store.id}`) ||
      store.password ||
      "store@123";
    if (password !== storePass) {
      setError("गलत पासवर्ड। कृपया फिर कोशिश करें।");
      return;
    }
    toast.success(`${store.name || store.city} में आपका स्वागत है!`);
    navigate({ to: "/store-dashboard", search: { storeId: String(store.id) } });
  };

  return (
    <div className="min-h-screen bg-secondary/20 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Store Owner Login
          </h1>
          <p className="text-muted-foreground mt-1">स्टोर लॉगिन</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center text-primary">
              🏪 अपने स्टोर में प्रवेश करें
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Store selector */}
            <div className="space-y-2">
              <Label htmlFor="store-city">Store / शहर चुनें</Label>
              <select
                id="store-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="store_login.select"
              >
                <option value="">-- शहर / City चुनें --</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.city}>
                    {s.name || s.city} — {s.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="store-password">Password / पासवर्ड</Label>
              <div className="relative">
                <input
                  id="store-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="पासवर्ड दर्ज करें"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="store_login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-destructive text-sm"
                data-ocid="store_login.error_state"
              >
                ⚠️ {error}
              </p>
            )}

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleLogin}
              data-ocid="store_login.submit_button"
            >
              Login करें / प्रवेश करें
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground mb-2">
                Default Password:{" "}
                <code className="bg-muted px-1 rounded">store@123</code>
              </p>
              <Link
                to="/"
                className="text-sm text-primary hover:underline"
                data-ocid="store_login.link"
              >
                ← धर्मा Mart होम पर वापस जाएं
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
