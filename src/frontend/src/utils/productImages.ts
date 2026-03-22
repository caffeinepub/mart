/**
 * Returns a valid, unique product image URL.
 * Uses local generated images to avoid broken external URLs.
 */

// Mapping from category/name keywords to generated images
const CATEGORY_IMAGE_MAP: Array<{ keywords: string[]; image: string }> = [
  // Food & Grocery
  {
    keywords: [
      "sunflower oil",
      "cooking oil",
      "mustard oil",
      "saffola",
      "fortune oil",
      "dabur oil",
      "refined oil",
    ],
    image: "/assets/generated/grocery-cooking-oil.dim_400x400.jpg",
  },
  {
    keywords: ["ghee", "amul", "butter"],
    image: "/assets/generated/grocery-ghee.dim_400x400.jpg",
  },
  {
    keywords: ["sugar", "jaggery", "shakkar", "tata sugar", "aashirvaad sugar"],
    image: "/assets/generated/grocery-sugar.dim_400x400.jpg",
  },
  {
    keywords: [
      "basmati",
      "sona masoori",
      "rice",
      "chawal",
      "idli mix",
      "rice product",
    ],
    image: "/assets/generated/grocery-basmati-rice.dim_400x400.jpg",
  },
  {
    keywords: ["atta", "flour", "besan", "maida", "ragi", "kuttu"],
    image: "/assets/generated/grocery-basmati-rice.dim_400x400.jpg",
  },
  {
    keywords: [
      "toor dal",
      "moong dal",
      "chana dal",
      "dal",
      "pulses",
      "rajma",
      "chana",
      "lentil",
    ],
    image: "/assets/generated/grocery-toor-dal.dim_400x400.jpg",
  },
  {
    keywords: [
      "masala",
      "spice",
      "turmeric",
      "chilli",
      "pepper",
      "cumin",
      "coriander",
      "garam masala",
      "mdh",
      "everest",
    ],
    image: "/assets/generated/grocery-garam-masala.dim_400x400.jpg",
  },
  {
    keywords: [
      "dry fruit",
      "almond",
      "cashew",
      "walnut",
      "pistachio",
      "raisin",
      "nut",
      "seed",
      "chia",
      "flax",
    ],
    image: "/assets/generated/grocery-ghee.dim_400x400.jpg",
  },
  {
    keywords: [
      "tea",
      "coffee",
      "nescafe",
      "tata tea",
      "darjeeling",
      "green tea",
      "bru",
    ],
    image: "/assets/generated/grocery-ghee.dim_400x400.jpg",
  },
  {
    keywords: [
      "juice",
      "soft drink",
      "cola",
      "pepsi",
      "coca",
      "red bull",
      "tropicana",
      "real mango",
      "sprite",
    ],
    image: "/assets/generated/grocery-cooking-oil.dim_400x400.jpg",
  },
  {
    keywords: [
      "chips",
      "namkeen",
      "lay",
      "haldiram",
      "bikaji",
      "kurkure",
      "snack",
      "biscuit",
      "wafer",
    ],
    image: "/assets/generated/grocery-ghee.dim_400x400.jpg",
  },
  // Mobile & Electronics
  {
    keywords: [
      "redmi",
      "realme",
      "oneplus",
      "oppo",
      "vivo",
      "nokia",
      "motorola",
      "iphone",
      "samsung galaxy",
      "pixel",
      "mobile phone",
      "smartphone",
    ],
    image: "/assets/generated/mobile-smartphone.dim_400x400.jpg",
  },
  {
    keywords: [
      "macbook",
      "laptop",
      "dell xps",
      "hp pavilion",
      "lenovo",
      "asus",
      "acer",
      "notebook",
    ],
    image: "/assets/generated/electronics-laptop.dim_400x400.jpg",
  },
  {
    keywords: [
      "bravia",
      "led tv",
      "smart tv",
      "television",
      "oled",
      "qled",
      "4k tv",
      "lg tv",
      "samsung tv",
    ],
    image: "/assets/generated/electronics-tv.dim_400x400.jpg",
  },
  {
    keywords: [
      "samsung galaxy a",
      "samsung galaxy s",
      "samsung galaxy m",
      "galaxy tab",
    ],
    image: "/assets/generated/electronics-smartphone.dim_400x400.jpg",
  },
  // Appliances
  {
    keywords: ["refrigerator", "fridge", "double door", "single door fridge"],
    image: "/assets/generated/appliance-refrigerator.dim_400x400.jpg",
  },
  {
    keywords: ["washing machine", "washer", "front load", "top load"],
    image: "/assets/generated/appliance-washing-machine.dim_400x400.jpg",
  },
  {
    keywords: [
      "mixer",
      "grinder",
      "juicer",
      "microwave",
      "oven",
      "induction",
      "air fryer",
      "toaster",
      "iron",
      "kettle",
    ],
    image: "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  },
  {
    keywords: [
      "air conditioner",
      "inverter ac",
      "split ac",
      "window ac",
      "air cooler",
      "fan",
      "heater",
      "room heater",
    ],
    image: "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  },
  // Fashion
  {
    keywords: [
      "trunk",
      "brief",
      "innerwear",
      "underwear",
      "vip frenchie",
      "jockey brief",
      "cotton brief",
    ],
    image: "/assets/generated/fashion-mens-innerwear.dim_400x400.jpg",
  },
  {
    keywords: [
      "t-shirt",
      "tshirt",
      "crew neck",
      "hanes",
      "polo shirt",
      "round neck",
    ],
    image: "/assets/generated/fashion-mens-tshirt-pack.dim_400x400.jpg",
  },
  {
    keywords: [
      "shirt",
      "formal shirt",
      "allen solly",
      "arrow shirt",
      "raymond",
    ],
    image: "/assets/generated/fashion-denim-jeans.dim_400x400.jpg",
  },
  {
    keywords: ["jeans", "trouser", "chino", "levi", "denim"],
    image: "/assets/generated/fashion-denim-jeans.dim_400x400.jpg",
  },
  {
    keywords: ["saree", "sari", "silk saree"],
    image: "/assets/generated/garment-saree.dim_400x400.jpg",
  },
  {
    keywords: [
      "kurta",
      "kurti",
      "salwar",
      "ethnic",
      "lehenga",
      "churidar",
      "anarkali",
    ],
    image: "/assets/generated/garment-kurta.dim_400x400.jpg",
  },
  {
    keywords: [
      "blazer",
      "suit",
      "jacket",
      "sweatshirt",
      "hoodie",
      "sweater",
      "thermal",
    ],
    image: "/assets/generated/fashion-denim-jeans.dim_400x400.jpg",
  },
  {
    keywords: ["sandal", "slipper", "chappal"],
    image: "/assets/generated/footwear-sandals.dim_400x400.jpg",
  },
  {
    keywords: [
      "shoe",
      "bata",
      "nike",
      "adidas",
      "puma",
      "formal shoe",
      "sneaker",
      "boot",
    ],
    image: "/assets/generated/footwear-formal-shoes.dim_400x400.jpg",
  },
  {
    keywords: ["kids shoe", "children shoe", "kids sandal"],
    image: "/assets/generated/footwear-kids-shoes.dim_400x400.jpg",
  },
  {
    keywords: [
      "wallet",
      "leather wallet",
      "purse",
      "handbag",
      "backpack",
      "bag",
      "suitcase",
      "luggage",
      "trolley",
    ],
    image: "/assets/generated/home-tiffin-box.dim_400x400.jpg",
  },
  // Smart Gadgets
  {
    keywords: [
      "earbuds",
      "earphone",
      "headphone",
      "boat",
      "jbl",
      "sony headphone",
      "neckband",
    ],
    image: "/assets/generated/smart-earbuds-boat.dim_400x400.jpg",
  },
  {
    keywords: [
      "smartwatch",
      "smart watch",
      "fitness band",
      "mi band",
      "noise",
      "boat watch",
      "fire-boltt",
    ],
    image: "/assets/generated/smart-watch-noise.dim_400x400.jpg",
  },
  {
    keywords: [
      "alexa",
      "echo",
      "google home",
      "smart bulb",
      "smart plug",
      "smart home",
    ],
    image: "/assets/generated/smart-echo-dot.dim_400x400.jpg",
  },
  {
    keywords: [
      "camera",
      "dslr",
      "canon",
      "nikon",
      "webcam",
      "action cam",
      "gopro",
    ],
    image: "/assets/generated/smart-gadgets.dim_400x400.jpg",
  },
  {
    keywords: ["power bank", "portable charger", "mi power", "ambrane"],
    image: "/assets/generated/smart-gadgets.dim_400x400.jpg",
  },
  {
    keywords: [
      "gaming",
      "controller",
      "joystick",
      "playstation",
      "xbox",
      "ps5",
    ],
    image: "/assets/generated/smart-gadgets.dim_400x400.jpg",
  },
  {
    keywords: [
      "keyboard",
      "mouse",
      "monitor",
      "printer",
      "scanner",
      "pen drive",
      "hard disk",
      "ssd",
      "usb hub",
    ],
    image: "/assets/generated/electronics-laptop.dim_400x400.jpg",
  },
  {
    keywords: [
      "phone case",
      "mobile cover",
      "screen protector",
      "charger",
      "cable",
      "otg",
    ],
    image: "/assets/generated/mobile-smartphone.dim_400x400.jpg",
  },
  // Beauty & Healthcare
  {
    keywords: [
      "face cream",
      "moisturizer",
      "sunscreen",
      "serum",
      "face wash",
      "toner",
      "skin",
    ],
    image: "/assets/generated/beauty-face-wash.dim_400x400.jpg",
  },
  {
    keywords: ["shampoo", "conditioner", "hair oil", "hair color", "hair care"],
    image: "/assets/generated/beauty-care-products.dim_400x400.jpg",
  },
  {
    keywords: ["perfume", "deodorant", "cologne", "body spray", "fragrance"],
    image: "/assets/generated/beauty-serum.dim_400x400.jpg",
  },
  {
    keywords: [
      "lipstick",
      "foundation",
      "mascara",
      "makeup",
      "kajal",
      "eyeliner",
      "blush",
    ],
    image: "/assets/generated/beauty-care-products.dim_400x400.jpg",
  },
  {
    keywords: ["body lotion", "body wash", "soap", "moisturizing lotion"],
    image: "/assets/generated/beauty-body-lotion.dim_400x400.jpg",
  },
  {
    keywords: [
      "blood pressure",
      "glucometer",
      "pulse oximeter",
      "thermometer",
      "health monitor",
      "bp monitor",
    ],
    image: "/assets/generated/healthcare-products.dim_400x400.jpg",
  },
  {
    keywords: [
      "protein powder",
      "whey",
      "supplement",
      "nutrition",
      "ensure",
      "horlicks",
      "boost",
    ],
    image: "/assets/generated/health-ensure-supplement.dim_400x400.jpg",
  },
  {
    keywords: [
      "baby diaper",
      "pampers",
      "baby lotion",
      "baby oil",
      "baby care",
      "baby food",
      "baby wipe",
    ],
    image: "/assets/generated/toys-doll.dim_400x400.jpg",
  },
  {
    keywords: [
      "trimmer",
      "hair dryer",
      "straightener",
      "epilator",
      "electric shaver",
      "beard trimmer",
    ],
    image: "/assets/generated/beauty-care-products.dim_400x400.jpg",
  },
  // Fitness & Sports
  {
    keywords: ["dumbbell", "barbell", "weight plate", "gym", "kettlebell"],
    image: "/assets/generated/sports-dumbbell-set.dim_400x400.jpg",
  },
  {
    keywords: [
      "yoga mat",
      "resistance band",
      "jump rope",
      "skipping rope",
      "fitness accessory",
    ],
    image: "/assets/generated/sports-yoga-mat.dim_400x400.jpg",
  },
  {
    keywords: [
      "treadmill",
      "running machine",
      "exercise bike",
      "cycle",
      "bicycle",
      "stationary bike",
    ],
    image: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  },
  {
    keywords: ["cricket bat", "cricket ball", "batting glove", "cricket"],
    image: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  },
  {
    keywords: ["badminton", "racket", "shuttlecock", "tennis"],
    image: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  },
  {
    keywords: [
      "helmet",
      "bike glove",
      "motorcycle",
      "cycle lock",
      "bike accessory",
    ],
    image: "/assets/generated/auto-accessories.dim_400x400.jpg",
  },
  {
    keywords: [
      "car seat cover",
      "car perfume",
      "dash cam",
      "car charger",
      "car accessory",
    ],
    image: "/assets/generated/auto-dash-cam.dim_400x400.jpg",
  },
  // Furniture
  {
    keywords: ["sofa", "couch", "3 seater", "recliner", "l-shaped sofa"],
    image: "/assets/generated/furniture-sofa.dim_400x400.jpg",
  },
  {
    keywords: ["wardrobe", "almirah", "bookshelf", "storage unit", "shoe rack"],
    image: "/assets/generated/furniture-wardrobe.dim_400x400.jpg",
  },
  {
    keywords: [
      "dining table",
      "coffee table",
      "center table",
      "study table",
      "computer table",
      "office desk",
    ],
    image: "/assets/generated/furniture-dining-table.dim_400x400.jpg",
  },
  {
    keywords: ["bed", "bunk bed", "king size", "queen size", "mattress"],
    image: "/assets/generated/furniture-sofa.dim_400x400.jpg",
  },
  {
    keywords: [
      "lamp",
      "light",
      "chandelier",
      "led strip",
      "wall decor",
      "photo frame",
      "showpiece",
      "vase",
    ],
    image: "/assets/generated/home-dinner-set.dim_400x400.jpg",
  },
  {
    keywords: [
      "drill",
      "screwdriver",
      "hammer",
      "tool",
      "plier",
      "wrench",
      "home tool",
    ],
    image: "/assets/generated/home-service.dim_400x400.jpg",
  },
  // Daily & Household
  {
    keywords: [
      "detergent",
      "surf excel",
      "ariel",
      "tide",
      "dishwash",
      "vim",
      "floor cleaner",
      "toilet cleaner",
    ],
    image: "/assets/generated/home-tiffin-box.dim_400x400.jpg",
  },
  {
    keywords: ["toothpaste", "toothbrush", "mouthwash", "colgate", "pepsodent"],
    image: "/assets/generated/beauty-face-wash.dim_400x400.jpg",
  },
  {
    keywords: [
      "notebook",
      "pen",
      "pencil",
      "stationery",
      "school supply",
      "color",
      "crayon",
      "geometry",
    ],
    image: "/assets/generated/books-collection.dim_400x400.jpg",
  },
  {
    keywords: [
      "toy",
      "doll",
      "rc car",
      "puzzle",
      "lego",
      "building block",
      "kids toy",
    ],
    image: "/assets/generated/toys-doll.dim_400x400.jpg",
  },
];

// Category-level fallback images
const CATEGORY_FALLBACK: Record<string, string> = {
  Mobiles: "/assets/generated/mobile-smartphone.dim_400x400.jpg",
  mobile: "/assets/generated/mobile-smartphone.dim_400x400.jpg",
  Laptops: "/assets/generated/electronics-laptop.dim_400x400.jpg",
  Televisions: "/assets/generated/electronics-tv.dim_400x400.jpg",
  electronics: "/assets/generated/electronics-smartphone.dim_400x400.jpg",
  "Air conditioners":
    "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  Refrigerators: "/assets/generated/appliance-refrigerator.dim_400x400.jpg",
  "Washing machines":
    "/assets/generated/appliance-washing-machine.dim_400x400.jpg",
  "Microwave oven": "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  "Kitchen appliances":
    "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  "Home appliances":
    "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  "Seasonal appliances":
    "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  appliances: "/assets/generated/appliance-mixer-grinder.dim_400x400.jpg",
  "Men's clothing": "/assets/generated/fashion-denim-jeans.dim_400x400.jpg",
  "Man's footwear & accessories":
    "/assets/generated/footwear-formal-shoes.dim_400x400.jpg",
  "Men's Essentials":
    "/assets/generated/fashion-mens-tshirt-pack.dim_400x400.jpg",
  "Woman's clothing": "/assets/generated/garment-salwar.dim_400x400.jpg",
  "Woman footwear & accessories":
    "/assets/generated/footwear-sandals.dim_400x400.jpg",
  "Women's Essentials":
    "/assets/generated/beauty-care-products.dim_400x400.jpg",
  "Kid's Fashion": "/assets/generated/footwear-kids-shoes.dim_400x400.jpg",
  fashion: "/assets/generated/fashion-denim-jeans.dim_400x400.jpg",
  "Suitcase, Bags & backpacks":
    "/assets/generated/home-tiffin-box.dim_400x400.jpg",
  "Headphones & speakers":
    "/assets/generated/smart-earbuds-boat.dim_400x400.jpg",
  "Smart wearables": "/assets/generated/smart-watch-noise.dim_400x400.jpg",
  "smart-gadgets": "/assets/generated/smart-gadgets.dim_400x400.jpg",
  Camera: "/assets/generated/smart-gadgets.dim_400x400.jpg",
  Gaming: "/assets/generated/smart-gadgets.dim_400x400.jpg",
  "Power banks": "/assets/generated/smart-gadgets.dim_400x400.jpg",
  "Mobile accessories": "/assets/generated/mobile-smartphone.dim_400x400.jpg",
  "Cases covers & more": "/assets/generated/mobile-smartphone.dim_400x400.jpg",
  "Computer accessories":
    "/assets/generated/electronics-laptop.dim_400x400.jpg",
  "Computer peripheral": "/assets/generated/electronics-laptop.dim_400x400.jpg",
  Storage: "/assets/generated/electronics-laptop.dim_400x400.jpg",
  "Personal care appliances":
    "/assets/generated/beauty-care-products.dim_400x400.jpg",
  Tables: "/assets/generated/furniture-dining-table.dim_400x400.jpg",
  "Smart home automation": "/assets/generated/smart-echo-dot.dim_400x400.jpg",
  "Health care device": "/assets/generated/healthcare-products.dim_400x400.jpg",
  "Home improvement tools": "/assets/generated/home-service.dim_400x400.jpg",
  "Decor & lighting": "/assets/generated/home-dinner-set.dim_400x400.jpg",
  "Skin care": "/assets/generated/beauty-face-wash.dim_400x400.jpg",
  "Hair care": "/assets/generated/beauty-care-products.dim_400x400.jpg",
  Fragrance: "/assets/generated/beauty-serum.dim_400x400.jpg",
  Beauty: "/assets/generated/beauty-care-products.dim_400x400.jpg",
  beauty: "/assets/generated/beauty-care-products.dim_400x400.jpg",
  "Daily essentials": "/assets/generated/home-tiffin-box.dim_400x400.jpg",
  "Baby care": "/assets/generated/toys-doll.dim_400x400.jpg",
  "Stationery & school supplies":
    "/assets/generated/books-collection.dim_400x400.jpg",
  "Nutrition & healthcare":
    "/assets/generated/health-ensure-supplement.dim_400x400.jpg",
  "Household supplies": "/assets/generated/home-tiffin-box.dim_400x400.jpg",
  sports: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  Sports: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  SportsCycles: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  "Exercise bikes": "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  "Premium Treadmills":
    "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  "Fitness accessories": "/assets/generated/sports-yoga-mat.dim_400x400.jpg",
  Cricket: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  Badminton: "/assets/generated/sports-fitness-products.dim_400x400.jpg",
  "Bike accessories": "/assets/generated/auto-accessories.dim_400x400.jpg",
  "Car accessories": "/assets/generated/auto-dash-cam.dim_400x400.jpg",
  auto: "/assets/generated/auto-accessories.dim_400x400.jpg",
  "Bedroom furniture": "/assets/generated/furniture-sofa.dim_400x400.jpg",
  "Living room furniture": "/assets/generated/furniture-sofa.dim_400x400.jpg",
  "Study & office furniture":
    "/assets/generated/furniture-dining-table.dim_400x400.jpg",
  "Dining & kitchen":
    "/assets/generated/furniture-dining-table.dim_400x400.jpg",
  "Outdoor furniture": "/assets/generated/furniture-sofa.dim_400x400.jpg",
  "Kids' room furniture": "/assets/generated/furniture-sofa.dim_400x400.jpg",
  "Storage furniture": "/assets/generated/furniture-wardrobe.dim_400x400.jpg",
  furniture: "/assets/generated/furniture-sofa.dim_400x400.jpg",
  "food-health": "/assets/generated/grocery-ghee.dim_400x400.jpg",
  home: "/assets/generated/home-dinner-set.dim_400x400.jpg",
  "home-service": "/assets/generated/home-service.dim_400x400.jpg",
  books: "/assets/generated/books-collection.dim_400x400.jpg",
  toys: "/assets/generated/toys-rc-car.dim_400x400.jpg",
  Good: "/assets/generated/grocery-ghee.dim_400x400.jpg",
};

export function getProductImage(product: {
  id?: string | number;
  name: string;
  category: string;
  image?: string;
}): string {
  const { image, name, category } = product;

  // Always trust uploaded or locally generated assets
  if (image) {
    if (
      image.startsWith("/assets/uploads/") ||
      image.startsWith("/assets/generated/")
    ) {
      return image;
    }
    // Do NOT trust external URLs (Unsplash, loremflickr, etc.) -- they return wrong images
    // Fall through to keyword-based lookup
  }

  // Search by product name keywords (most specific)
  const nameLower = name.toLowerCase();
  for (const entry of CATEGORY_IMAGE_MAP) {
    for (const kw of entry.keywords) {
      if (nameLower.includes(kw)) {
        return entry.image;
      }
    }
  }

  // Fallback by category
  if (CATEGORY_FALLBACK[category]) {
    return CATEGORY_FALLBACK[category];
  }
  const catLower = (category || "").toLowerCase();
  if (CATEGORY_FALLBACK[catLower]) {
    return CATEGORY_FALLBACK[catLower];
  }

  // Default fallback
  return "/assets/generated/grocery-ghee.dim_400x400.jpg";
}
