import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMetaTags } from "@/hooks/useMetaTags";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const INFO_CARDS = [
  {
    icon: Phone,
    title: "Phone / फोन",
    lines: ["1800-DHARMA-1 (Toll Free)", "+91 98765 43210"],
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Mail,
    title: "Email / ईमेल",
    lines: ["support@dharmamart.in", "business@dharmamart.in"],
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: MapPin,
    title: "Head Office",
    lines: ["12, Dharma Towers, MG Road", "New Delhi - 110001"],
    color: "bg-green-50 text-green-700",
  },
  {
    icon: Clock,
    title: "Hours / समय",
    lines: ["Mon–Sat: 9:00 AM – 9:00 PM", "Sun: 10:00 AM – 6:00 PM"],
    color: "bg-orange-50 text-orange-700",
  },
];

const SOCIAL = [
  {
    label: "WhatsApp",
    emoji: "💬",
    href: "https://wa.me/919876543210?text=Hello%20Dharma%20Mart",
  },
  { label: "Instagram", emoji: "📸", href: "https://instagram.com/dharmamart" },
  { label: "Facebook", emoji: "👍", href: "https://facebook.com/dharmamart" },
];

export function ContactPage() {
  useMetaTags({
    title: "Contact Us",
    description: "Get in touch with धर्मा Mart. Call, email or visit us.",
  });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon. 🙏");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="contact.page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-2">
          Contact Us / संपर्क करें
        </h1>
        <p className="text-muted-foreground mb-8">
          हमसे कुछ भी पूछें — हम 24 घंटे में जवाब देंगे।
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {INFO_CARDS.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {card.title}
                </p>
                {card.lines.map((line) => (
                  <p
                    key={line}
                    className="text-xs text-muted-foreground mt-0.5"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div
            className="bg-card border border-border rounded-xl p-6"
            data-ocid="contact.form.card"
          >
            <h2 className="font-bold text-primary text-lg mb-5">
              ✉️ Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="c-name">Name *</Label>
                <Input
                  id="c-name"
                  className="mt-1"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Your name"
                  data-ocid="contact.name.input"
                />
              </div>
              <div>
                <Label htmlFor="c-email">Email *</Label>
                <Input
                  id="c-email"
                  type="email"
                  className="mt-1"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  data-ocid="contact.email.input"
                />
              </div>
              <div>
                <Label htmlFor="c-msg">Message *</Label>
                <Textarea
                  id="c-msg"
                  className="mt-1"
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="How can we help you?"
                  data-ocid="contact.message.textarea"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-white h-11 font-semibold"
                disabled={sending}
                data-ocid="contact.submit.primary_button"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Social + Map */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-bold text-primary text-lg mb-4">
                🌐 Social Media
              </h2>
              <div className="flex flex-col gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    data-ocid={`contact.${s.label.toLowerCase()}.link`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="font-semibold text-sm">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-bold text-primary text-lg mb-3">
                🏪 Visit Our Stores
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                8 शहरों में हमारे स्टोर हैं — दिल्ली, मुंबई, बेंगलुरु, हैदराबाद, चेन्नई, कोलकाता,
                पुणे, अहमदाबाद।
              </p>
              <a href="/stores">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white w-full"
                  data-ocid="contact.stores.button"
                >
                  View Store Locator
                </Button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
