export interface SampleProduct {
  id: number;
  name: string;
  nameHindi: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  emoji: string;
  isFeatured: boolean;
  isDeal: boolean;
  stock: number;
  badge?: string;
}

export interface SampleStore {
  id: number;
  city: string;
  address: string;
  phone: string;
  pincode: string;
  timings: string;
}

export const CATEGORIES = [
  { id: "grocery", label: "GROCERY", labelHindi: "किराना", emoji: "🌾" },
  { id: "fashion", label: "FASHION", labelHindi: "फैशन", emoji: "👗" },
  {
    id: "electronics",
    label: "ELECTRONICS",
    labelHindi: "इलेक्ट्रॉनिक्स",
    emoji: "📱",
  },
  { id: "home", label: "HOME & KITCHEN", labelHindi: "घर & रसोई", emoji: "🏠" },
  {
    id: "personal",
    label: "PERSONAL CARE",
    labelHindi: "व्यक्तिगत देखभाल",
    emoji: "💆",
  },
  { id: "snacks", label: "BEST SELLERS", labelHindi: "बेस्ट सेलर", emoji: "⭐" },
];

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 1,
    name: "Daawat Basmati Rice (25kg)",
    nameHindi: "दावत बासमती चावल",
    description:
      "Premium aged basmati rice with long grains and delightful aroma. Perfect for biryani, pulao and all rice dishes. Grown in the foothills of Himalayas.",
    price: 1299,
    originalPrice: 1599,
    category: "grocery",
    emoji: "🌾",
    isFeatured: true,
    isDeal: false,
    stock: 200,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Toor Dal Premium (5kg)",
    nameHindi: "तूर दाल प्रीमियम",
    description:
      "100% natural, unpolished toor dal (pigeon peas). Rich in protein and fiber. Perfect for dal tadka, sambar and everyday cooking.",
    price: 499,
    originalPrice: 599,
    category: "grocery",
    emoji: "🫘",
    isFeatured: true,
    isDeal: true,
    stock: 150,
    badge: "Deal",
  },
  {
    id: 3,
    name: "Men's Cotton Kurta Set",
    nameHindi: "पुरुषों का कॉटन कुर्ता सेट",
    description:
      "Elegant hand-block printed cotton kurta with matching pajama. Perfect for festivals, pujas and casual occasions. Available in multiple colors.",
    price: 799,
    originalPrice: 1299,
    category: "fashion",
    emoji: "👘",
    isFeatured: true,
    isDeal: true,
    stock: 80,
    badge: "Diwali Special",
  },
  {
    id: 4,
    name: "Kanjivaram Silk Saree",
    nameHindi: "कांजीवरम सिल्क साड़ी",
    description:
      "Authentic Kanjivaram silk saree with traditional zari work and vibrant colors. A timeless classic for weddings and special occasions.",
    price: 4999,
    originalPrice: 7999,
    category: "fashion",
    emoji: "👒",
    isFeatured: false,
    isDeal: false,
    stock: 30,
    badge: "Premium",
  },
  {
    id: 5,
    name: "Samsung Galaxy A54 5G",
    nameHindi: "सैमसंग गैलेक्सी A54",
    description:
      "50MP camera, 5000mAh battery, 5G connectivity. Stunning display with smooth 120Hz refresh rate. The perfect everyday smartphone.",
    price: 28999,
    originalPrice: 34999,
    category: "electronics",
    emoji: "📱",
    isFeatured: true,
    isDeal: false,
    stock: 45,
    badge: "New",
  },
  {
    id: 6,
    name: "Prestige Iris 750W Mixer Grinder",
    nameHindi: "प्रेस्टीज मिक्सर ग्राइंडर",
    description:
      "750W powerful motor with 3 stainless steel jars. Insta-fresh juicer attachment included. Ideal for Indian spices, chutneys and smoothies.",
    price: 3499,
    originalPrice: 4999,
    category: "home",
    emoji: "🥤",
    isFeatured: true,
    isDeal: true,
    stock: 60,
    badge: "Deal",
  },
  {
    id: 7,
    name: "Aashirvaad Whole Wheat Atta (10kg)",
    nameHindi: "आशीर्वाद गेहूँ का आटा",
    description:
      "Made from carefully selected wheat grains. Superior taste, nutrition and softness for perfect rotis and parathas every day.",
    price: 450,
    originalPrice: 520,
    category: "grocery",
    emoji: "🌾",
    isFeatured: false,
    isDeal: true,
    stock: 300,
    badge: "Value Pack",
  },
  {
    id: 8,
    name: "Kurkure Masala Munch (Pack of 6)",
    nameHindi: "कुरकुरे मसाला मंच",
    description:
      "India's favourite crunchy snack! Real corn with zesty masala flavour. Perfect for parties, evening snacks and movie time.",
    price: 120,
    category: "snacks",
    emoji: "🌽",
    isFeatured: false,
    isDeal: true,
    stock: 500,
    badge: "Fan Favourite",
  },
  {
    id: 9,
    name: "Philips HD9252 Air Fryer",
    nameHindi: "फिलिप्स एयर फ्रायर",
    description:
      "Fry with up to 90% less fat! Rapid Air Technology for crispy results. Ideal for samosas, french fries, chicken tikka and more.",
    price: 6999,
    originalPrice: 9999,
    category: "home",
    emoji: "🍳",
    isFeatured: true,
    isDeal: false,
    stock: 25,
    badge: "Popular",
  },
  {
    id: 10,
    name: "Woodland Casual Shoes (Men's)",
    nameHindi: "वुडलैंड कैज़ुअल शूज",
    description:
      "Premium leather upper with durable rubber sole. Rugged outdoor styling meets everyday comfort. Ideal for trekking, college and casual wear.",
    price: 2499,
    originalPrice: 3499,
    category: "fashion",
    emoji: "👟",
    isFeatured: false,
    isDeal: false,
    stock: 70,
  },
  {
    id: 11,
    name: "Patanjali Aloe Vera Gel",
    nameHindi: "पतंजलि एलोवेरा जेल",
    description:
      "100% pure aloe vera gel enriched with natural extracts. Moisturizes, soothes and nourishes skin. Suitable for all skin types.",
    price: 149,
    originalPrice: 199,
    category: "personal",
    emoji: "🌿",
    isFeatured: false,
    isDeal: true,
    stock: 200,
    badge: "Natural",
  },
  {
    id: 12,
    name: "Havells 1.5 Ton 3 Star AC",
    nameHindi: "हैवेल्स 1.5 टन AC",
    description:
      "Energy-efficient 3-star rated split AC with PM 2.5 filter. Auto clean technology, turbo cool mode and self-cleaning evaporator.",
    price: 34999,
    originalPrice: 42999,
    category: "electronics",
    emoji: "❄️",
    isFeatured: true,
    isDeal: false,
    stock: 15,
    badge: "Energy Saver",
  },
];

export const SAMPLE_STORES: SampleStore[] = [
  {
    id: 1,
    city: "New Delhi",
    address: "Palika Bazaar, Connaught Place",
    phone: "+91 11 2345 6789",
    pincode: "110001",
    timings: "9:00 AM – 9:00 PM",
  },
  {
    id: 2,
    city: "Mumbai",
    address: "Linking Road, Bandra West",
    phone: "+91 22 3456 7890",
    pincode: "400050",
    timings: "10:00 AM – 10:00 PM",
  },
  {
    id: 3,
    city: "Bangalore",
    address: "80 Feet Road, Koramangala",
    phone: "+91 80 4567 8901",
    pincode: "560034",
    timings: "9:30 AM – 9:30 PM",
  },
  {
    id: 4,
    city: "Chennai",
    address: "Usman Road, T Nagar",
    phone: "+91 44 5678 9012",
    pincode: "600017",
    timings: "10:00 AM – 9:00 PM",
  },
  {
    id: 5,
    city: "Hyderabad",
    address: "Road No. 12, Banjara Hills",
    phone: "+91 40 6789 0123",
    pincode: "500034",
    timings: "9:00 AM – 9:30 PM",
  },
  {
    id: 6,
    city: "Kolkata",
    address: "Shakespeare Sarani, Park Street",
    phone: "+91 33 7890 1234",
    pincode: "700017",
    timings: "10:00 AM – 9:00 PM",
  },
  {
    id: 7,
    city: "Pune",
    address: "FC Road, Deccan Gymkhana",
    phone: "+91 20 8901 2345",
    pincode: "411004",
    timings: "9:30 AM – 9:30 PM",
  },
  {
    id: 8,
    city: "Ahmedabad",
    address: "CG Road, Navrangpura",
    phone: "+91 79 9012 3456",
    pincode: "380009",
    timings: "9:00 AM – 9:00 PM",
  },
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProductBySlug(slug: string): SampleProduct | undefined {
  return SAMPLE_PRODUCTS.find((p) => slugify(p.name) === slug);
}
