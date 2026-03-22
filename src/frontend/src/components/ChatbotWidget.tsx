import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
}

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Delivery कब होगी?",
    a: "आपका ऑर्डर 2-5 business days में deliver होगा। ₹499 से ऊपर के orders पर Free Delivery है! 🚚",
  },
  {
    q: "Return Policy क्या है?",
    a: "हमारी 7-day return policy है। Product में कोई defect हो तो हम full refund देते हैं। 📦",
  },
  {
    q: "Payment कैसे करें?",
    a: "हम UPI, Credit/Debit Card, Net Banking और Cash on Delivery accept करते हैं। 💳",
  },
  {
    q: "Order track करें",
    a: "आप /order-tracking page पर जाकर अपने orders track कर सकते हैं। Order ID साथ रखें। 📍",
  },
  {
    q: "Coupon Code",
    a: "हमारे active coupons: DHARMA10 (10% off), DHARMA20 (20% off), WELCOME50 (₹50 off)। Checkout पर apply करें! 🎁",
  },
  {
    q: "Store कहाँ है?",
    a: "हमारे 8 शहरों में stores हैं — दिल्ली, मुंबई, बेंगलुरु, हैदराबाद, चेन्नई, कोलकाता, पुणे, अहमदाबाद। Store Locator पर जाएं! 🏪",
  },
];

const GREETING =
  "नमस्ते! 🙏 मैं धर्मा Mart का सहायक हूँ। नीचे से अपना सवाल चुनें या type करें!";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "g", type: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");

  const addMsg = (type: "user" | "bot", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + type, type, text },
    ]);
  };

  const handleFaq = (faq: { q: string; a: string }) => {
    addMsg("user", faq.q);
    setTimeout(() => addMsg("bot", faq.a), 400);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMsg("user", text);
    setInput("");
    const match = FAQ.find(
      (f) =>
        f.q.toLowerCase().includes(text.toLowerCase()) ||
        text.toLowerCase().includes(f.q.toLowerCase().split(" ")[0]),
    );
    setTimeout(() => {
      if (match) {
        addMsg("bot", match.a);
      } else {
        addMsg(
          "bot",
          "इस सवाल के लिए हमारे support team से संपर्क करें: 1800-DHARMA-1 या support@dharmamart.in 📞",
        );
      }
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" data-ocid="chatbot.widget">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 h-[420px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            data-ocid="chatbot.panel"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪔</span>
                <div>
                  <p className="font-bold text-white text-sm">धर्मा Mart Help</p>
                  <p className="text-white/70 text-[11px]">
                    Always here for you
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white"
                data-ocid="chatbot.close_button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.type === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {FAQ.map((faq) => (
                  <button
                    key={faq.q}
                    type="button"
                    onClick={() => handleFaq(faq)}
                    className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 hover:bg-primary/20 transition-colors border border-primary/20"
                    data-ocid="chatbot.faq.button"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2 flex-shrink-0">
              <input
                className="flex-1 text-sm bg-secondary rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                data-ocid="chatbot.message.input"
              />
              <button
                type="button"
                onClick={handleSend}
                className="bg-primary text-white rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
                data-ocid="chatbot.send.button"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((p) => !p)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        data-ocid="chatbot.open_modal_button"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
