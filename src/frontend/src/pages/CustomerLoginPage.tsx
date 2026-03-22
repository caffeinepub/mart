import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCustomer } from "@/context/CustomerContext";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CustomerLoginPage() {
  const { customer, login, saveCustomer } = useCustomer();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      navigate({ to: "/my-account" });
    }
  }, [customer, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "नाम जरूरी है";
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = "सही 10 अंकों का मोबाइल नंबर डालें";
    if (!form.address.trim()) e.address = "पता जरूरी है";
    if (!form.city.trim()) e.city = "शहर का नाम जरूरी है";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const newCustomer = {
        id: `cust_${form.mobile}`,
        name: form.name.trim(),
        mobile: form.mobile,
        address: form.address.trim(),
        city: form.city.trim(),
        registeredAt: new Date().toISOString(),
      };
      saveCustomer(newCustomer);
      login(newCustomer);
      toast.success(`स्वागत है, ${newCustomer.name}! 🙏`);
      navigate({ to: "/my-account" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-secondary/40 to-background"
      data-ocid="customer.login.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header Card */}
        <div className="bg-primary rounded-t-2xl px-8 py-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
            <User className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Login / Register</h1>
          <p className="text-white/70 text-sm mt-1 font-devanagari">
            अपना खाता बनाएं या लॉगिन करें
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border border-t-0 rounded-b-2xl shadow-xl px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-semibold">
                नाम (Name) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="आपका पूरा नाम"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-1 h-11"
                data-ocid="customer.login.name.input"
              />
              {errors.name && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="customer.login.name_error"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <Label htmlFor="mobile" className="text-sm font-semibold">
                मोबाइल नंबर <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={form.mobile}
                  onChange={(e) =>
                    update(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className="pl-10 h-11"
                  maxLength={10}
                  data-ocid="customer.login.mobile.input"
                />
              </div>
              {errors.mobile && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="customer.login.mobile_error"
                >
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city" className="text-sm font-semibold">
                शहर (City) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="आपका शहर"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="mt-1 h-11"
                data-ocid="customer.login.city.input"
              />
              {errors.city && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="customer.login.city_error"
                >
                  {errors.city}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="text-sm font-semibold">
                पता (Address) <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                placeholder="घर का पूरा पता"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="mt-1 min-h-[80px] resize-none"
                data-ocid="customer.login.address.textarea"
              />
              {errors.address && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="customer.login.address_error"
                >
                  {errors.address}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-accent hover:opacity-90 text-white font-bold text-base gap-2 mt-2"
              disabled={loading}
              data-ocid="customer.login.submit_button"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Login / Register करें 🙏"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            मोबाइल नंबर से पहचान होती है। अगर आप पहले से registered हैं तो same number
            डालें।
          </p>
        </div>
      </motion.div>
    </div>
  );
}
