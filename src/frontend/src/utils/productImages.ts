/**
 * Returns a valid, unique product image URL.
 * Falls back to a relevant placeholder if the stored image looks duplicated/fake.
 */

// Category to search keyword mapping for relevant images
const categoryKeywords: Record<string, string> = {
  "Ghee & oils": "cooking+oil",
  "Sugar, jaggery & salt": "sugar+salt",
  "Rice & Rice products": "rice",
  "Atta & flours": "flour+wheat",
  "Dry fruits, Nuts & seeds": "nuts+almonds",
  "Dals & pulses": "lentils+dal",
  "Masalas & spices": "spices",
  "Coffee & tea": "tea+coffee",
  "Juices & soft drinks": "juice+drink",
  "Chips & namkeen": "snacks",
  Mobiles: "smartphone",
  Laptops: "laptop",
  Televisions: "television",
  "Air conditioners": "air+conditioner",
  Refrigerators: "refrigerator",
  "Washing machines": "washing+machine",
  "Kitchen appliances": "kitchen",
  "Home appliances": "appliance",
  "Microwave oven": "microwave",
  "Seasonal appliances": "fan+heater",
  "Men's clothing": "mens+shirt",
  "Man's footwear & accessories": "shoes",
  "Men's Essentials": "grooming",
  "Woman's clothing": "womens+dress",
  "Woman footwear & accessories": "womens+shoes",
  "Women's Essentials": "beauty+women",
  "Kid's Fashion": "kids+clothes",
  "Suitcase, Bags & backpacks": "bag+backpack",
  Camera: "camera",
  "Headphones & speakers": "headphones",
  "Smart wearables": "smartwatch",
  Gaming: "gaming+controller",
  "Power banks": "powerbank",
  "Mobile accessories": "phone+accessories",
  "Cases covers & more": "phone+case",
  "Computer accessories": "computer",
  "Computer peripheral": "keyboard+mouse",
  Storage: "hard+drive",
  "Personal care appliances": "hair+dryer",
  Tables: "table+furniture",
  "Smart home automation": "smart+home",
  "Health care device": "health+device",
  "Home improvement tools": "tools",
  "Decor & lighting": "home+decor",
  "Skin care": "skincare",
  "Hair care": "shampoo",
  Fragrance: "perfume",
  Beauty: "makeup",
  "Daily essentials": "daily+essentials",
  "Baby care": "baby",
  "Stationery & school supplies": "stationery",
  Good: "food",
  "Nutrition & healthcare": "nutrition",
  "Household supplies": "cleaning",
  Sports: "sports",
  SportsCycles: "bicycle",
  "Exercise bikes": "exercise+bike",
  "Premium Treadmills": "treadmill",
  "Fitness accessories": "fitness",
  Cricket: "cricket",
  Badminton: "badminton",
  "Bike accessories": "motorcycle",
  "Car accessories": "car",
  "Bedroom furniture": "bedroom",
  "Living room furniture": "sofa+living",
  "Study & office furniture": "office+desk",
  "Dining & kitchen": "dining+table",
  "Outdoor furniture": "outdoor+garden",
  "Kids' room furniture": "kids+room",
  "Storage furniture": "wardrobe+storage",
  // legacy categories
  electronics: "electronics",
  mobile: "smartphone",
  fashion: "fashion+clothing",
  "food-health": "food+grocery",
  appliances: "home+appliance",
  auto: "car+accessories",
  beauty: "beauty+cosmetics",
  books: "books",
  furniture: "furniture",
  home: "home+decor",
  "home-service": "home+service",
  "smart-gadgets": "gadgets",
  sports: "sports",
  toys: "toys",
};

// Known bad/fake Unsplash photo base IDs that are duplicated
const FAKE_PHOTO_BASES = [
  "1585771724684",
  "1631083083327",
  "1597328701012",
  "1584308666744",
  "1601784551446",
  "1522337360801",
  "1558618047",
  "1605557021",
  "1541804793",
  "1581244682",
  "1434494434",
  "1605464285906",
];

function isFakeUnsplashUrl(url: string): boolean {
  if (!url) return true;
  if (!url.includes("unsplash.com")) return false;
  return FAKE_PHOTO_BASES.some((base) => url.includes(base));
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getProductImage(product: {
  id?: string | number;
  name: string;
  category: string;
  image?: string;
}): string {
  const { image, name, category, id } = product;

  // Use stored image if it looks valid (uploaded asset or non-fake Unsplash)
  if (image) {
    if (
      image.startsWith("/assets/uploads/") ||
      image.startsWith("/assets/generated/")
    ) {
      return image;
    }
    if (image.startsWith("https://") && !isFakeUnsplashUrl(image)) {
      return image;
    }
  }

  // Build a seed from product id + name for uniqueness
  const seed = `${id || ""}-${name}`;
  const hash = hashString(seed);

  // Get keyword for this category
  const keyword =
    categoryKeywords[category] ||
    categoryKeywords[category?.toLowerCase()] ||
    "product";

  // Use loremflickr for category-relevant images with unique seed
  const uniqueSeed = hash % 9999;
  return `https://loremflickr.com/400/400/${keyword}?lock=${uniqueSeed}`;
}
