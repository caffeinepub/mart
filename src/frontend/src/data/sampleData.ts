export interface SampleProduct {
  id: number;
  name: string;
  nameHindi: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  emoji: string;
  image?: string;
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
  { id: "all", label: "ALL", labelHindi: "सभी", emoji: "🛍️" },
  {
    id: "electronics",
    label: "ELECTRONICS",
    labelHindi: "इलेक्ट्रॉनिक्स",
    emoji: "📱",
  },
  { id: "fashion", label: "GARMENTS", labelHindi: "कपड़े", emoji: "👗" },
  { id: "footwear", label: "FOOTWEAR", labelHindi: "जूते-चप्पल", emoji: "👟" },
  { id: "toys", label: "TOYS", labelHindi: "खिलौने", emoji: "🧸" },
  { id: "furniture", label: "FURNITURE", labelHindi: "फर्नीचर", emoji: "🛋️" },
  { id: "grocery", label: "GROCERY", labelHindi: "किराना", emoji: "🌾" },
  { id: "home", label: "HOME & KITCHEN", labelHindi: "घर & रसोई", emoji: "🏠" },
];

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  // Electronics
  {
    id: 1,
    name: "Samsung Galaxy A54 5G",
    nameHindi: "सैमसंग गैलेक्सी A54",
    description:
      "50MP camera, 5000mAh battery, 5G connectivity. Stunning display with smooth 120Hz refresh rate. The perfect everyday smartphone.",
    price: 28999,
    originalPrice: 34999,
    category: "electronics",
    emoji: "📱",
    image: "/assets/generated/electronics-smartphone.dim_400x400.jpg",
    isFeatured: true,
    isDeal: false,
    stock: 45,
    badge: "New",
  },
  {
    id: 2,
    name: 'Sony Bravia 43" Smart LED TV',
    nameHindi: 'सोनी ब्राविया 43" स्मार्ट TV',
    description:
      "4K Ultra HD Smart TV with Android OS, Dolby Audio, and built-in WiFi. Perfect for streaming movies and live cricket.",
    price: 39999,
    originalPrice: 54999,
    category: "electronics",
    emoji: "📺",
    image: "/assets/generated/electronics-tv.dim_400x400.jpg",
    isFeatured: true,
    isDeal: true,
    stock: 20,
    badge: "Best Deal",
  },
  {
    id: 3,
    name: "HP Laptop 15s Core i5",
    nameHindi: "HP लैपटॉप 15s कोर i5",
    description:
      "Intel Core i5 12th Gen, 8GB RAM, 512GB SSD, Windows 11. Ideal for work, college and entertainment.",
    price: 52999,
    originalPrice: 65999,
    category: "electronics",
    emoji: "💻",
    image: "/assets/generated/electronics-laptop.dim_400x400.jpg",
    isFeatured: false,
    isDeal: true,
    stock: 15,
    badge: "Popular",
  },
  // Garments / Fashion
  {
    id: 4,
    name: "Men's Cotton Kurta Set",
    nameHindi: "पुरुषों का कॉटन कुर्ता सेट",
    description:
      "Elegant hand-block printed cotton kurta with matching pajama. Perfect for festivals, pujas and casual occasions.",
    price: 799,
    originalPrice: 1299,
    category: "fashion",
    emoji: "👘",
    image: "/assets/generated/garment-kurta.dim_400x400.jpg",
    isFeatured: true,
    isDeal: true,
    stock: 80,
    badge: "Diwali Special",
  },
  {
    id: 5,
    name: "Kanjivaram Silk Saree",
    nameHindi: "कांजीवरम सिल्क साड़ी",
    description:
      "Authentic Kanjivaram silk saree with traditional zari work and vibrant colors. A timeless classic for weddings and special occasions.",
    price: 4999,
    originalPrice: 7999,
    category: "fashion",
    emoji: "👒",
    image: "/assets/generated/garment-saree.dim_400x400.jpg",
    isFeatured: true,
    isDeal: false,
    stock: 30,
    badge: "Premium",
  },
  {
    id: 6,
    name: "Women's Salwar Kameez Set",
    nameHindi: "महिलाओं का सलवार कमीज़ सेट",
    description:
      "Beautiful cotton salwar kameez with dupatta. Comfortable for daily wear and festive occasions. Available in multiple colors.",
    price: 1199,
    originalPrice: 1799,
    category: "fashion",
    emoji: "👗",
    image: "/assets/generated/garment-salwar.dim_400x400.jpg",
    isFeatured: false,
    isDeal: true,
    stock: 100,
    badge: "Trending",
  },
  // Footwear
  {
    id: 7,
    name: "Woodland Men's Leather Shoes",
    nameHindi: "वुडलैंड पुरुष लेदर शूज",
    description:
      "Premium brown leather formal shoes, polished finish. Durable rubber sole for all-day comfort. Great for office and events.",
    price: 2499,
    originalPrice: 3499,
    category: "footwear",
    emoji: "👞",
    image: "/assets/generated/footwear-formal-shoes.dim_400x400.jpg",
    isFeatured: true,
    isDeal: false,
    stock: 70,
    badge: "Bestseller",
  },
  {
    id: 8,
    name: "Women's Embellished Sandals",
    nameHindi: "महिलाओं की एम्बेलिश्ड सैंडल",
    description:
      "Traditional golden flat chappals with decorative embellishments. Perfect for ethnic outfits and festive occasions.",
    price: 699,
    originalPrice: 999,
    category: "footwear",
    emoji: "👡",
    image: "/assets/generated/footwear-sandals.dim_400x400.jpg",
    isFeatured: true,
    isDeal: true,
    stock: 120,
    badge: "Festival Pick",
  },
  {
    id: 9,
    name: "Kids Sports Running Shoes",
    nameHindi: "बच्चों के स्पोर्ट्स शूज",
    description:
      "Lightweight, comfortable running shoes for kids. Anti-slip sole and breathable mesh upper. Available in sizes 1–6.",
    price: 899,
    originalPrice: 1299,
    category: "footwear",
    emoji: "👟",
    image: "/assets/generated/footwear-kids-shoes.dim_400x400.jpg",
    isFeatured: false,
    isDeal: true,
    stock: 90,
    badge: "Kids Favourite",
  },
  // Toys
  {
    id: 10,
    name: "Colorful Building Blocks Set",
    nameHindi: "रंगीन बिल्डिंग ब्लॉक्स सेट",
    description:
      "120-piece colorful plastic building blocks for kids aged 3+. Develops creativity and motor skills. Safe, non-toxic material.",
    price: 549,
    originalPrice: 799,
    category: "toys",
    emoji: "🧱",
    image: "/assets/generated/toys-building-blocks.dim_400x400.jpg",
    isFeatured: true,
    isDeal: true,
    stock: 200,
    badge: "Age 3+",
  },
  {
    id: 11,
    name: "Remote Control Racing Car",
    nameHindi: "रिमोट कंट्रोल रेसिंग कार",
    description:
      "High-speed RC car with full directional control, rechargeable battery. Suitable for kids aged 6+. Hours of fun guaranteed!",
    price: 1299,
    originalPrice: 1999,
    category: "toys",
    emoji: "🚗",
    image: "/assets/generated/toys-rc-car.dim_400x400.jpg",
    isFeatured: true,
    isDeal: false,
    stock: 80,
    badge: "Hit Gift",
  },
  {
    id: 12,
    name: "Indian Baby Doll",
    nameHindi: "इंडियन बेबी डॉल",
    description:
      "Cute soft fabric baby doll in traditional Indian dress. Perfect gift for girls aged 2–8. Safe, washable, and durable.",
    price: 449,
    originalPrice: 649,
    category: "toys",
    emoji: "🪆",
    image: "/assets/generated/toys-doll.dim_400x400.jpg",
    isFeatured: false,
    isDeal: true,
    stock: 150,
    badge: "Girls Favourite",
  },
  // Furniture
  {
    id: 13,
    name: "3-Seater Sofa Set",
    nameHindi: "3 सीटर सोफा सेट",
    description:
      "Modern wooden frame sofa with premium beige cushions. Comfortable and stylish for Indian living rooms. Easy to assemble.",
    price: 18999,
    originalPrice: 27999,
    category: "furniture",
    emoji: "🛋️",
    image: "/assets/generated/furniture-sofa.dim_400x400.jpg",
    isFeatured: true,
    isDeal: true,
    stock: 10,
    badge: "Home Special",
  },
  {
    id: 14,
    name: "Teak Wood Dining Table Set",
    nameHindi: "टीक वुड डाइनिंग टेबल सेट",
    description:
      "Solid teak wood dining table with 4 matching chairs. Classic Indian home furniture with durable finish. Seats 4 comfortably.",
    price: 24999,
    originalPrice: 35999,
    category: "furniture",
    emoji: "🪑",
    image: "/assets/generated/furniture-dining-table.dim_400x400.jpg",
    isFeatured: false,
    isDeal: false,
    stock: 8,
    badge: "Premium Wood",
  },
  {
    id: 15,
    name: "3-Door Wardrobe with Mirror",
    nameHindi: "3 दरवाज़े वाली अलमारी",
    description:
      "Spacious 3-door wooden wardrobe with full-length mirror, multiple shelves and hanging rod. Perfect for Indian bedrooms.",
    price: 16499,
    originalPrice: 22999,
    category: "furniture",
    emoji: "🚪",
    image: "/assets/generated/furniture-wardrobe.dim_400x400.jpg",
    isFeatured: true,
    isDeal: false,
    stock: 12,
    badge: "Space Saver",
  },
  // Grocery
  {
    id: 16,
    name: "Daawat Basmati Rice (25kg)",
    nameHindi: "दावत बासमती चावल",
    description:
      "Premium aged basmati rice with long grains and delightful aroma. Perfect for biryani and pulao.",
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
    id: 17,
    name: "Toor Dal Premium (5kg)",
    nameHindi: "तूर दाल प्रीमियम",
    description:
      "100% natural, unpolished toor dal (pigeon peas). Rich in protein and fiber. Perfect for dal tadka and sambar.",
    price: 499,
    originalPrice: 599,
    category: "grocery",
    emoji: "🫘",
    isFeatured: false,
    isDeal: true,
    stock: 150,
    badge: "Deal",
  },
  // Home & Kitchen
  {
    id: 18,
    name: "Prestige Iris 750W Mixer Grinder",
    nameHindi: "प्रेस्टीज मिक्सर ग्राइंडर",
    description:
      "750W powerful motor with 3 stainless steel jars. Ideal for Indian spices, chutneys and smoothies.",
    price: 3499,
    originalPrice: 4999,
    category: "home",
    emoji: "🥤",
    isFeatured: true,
    isDeal: true,
    stock: 60,
    badge: "Deal",
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
