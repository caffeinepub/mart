# धर्मा Mart - Category Consolidation & Persistence Fixes

## Current State
- 65+ categories exist in CATEGORIES array (sampleData.ts)
- Products spread across many sub-categories (Men's Essentials, Air conditioners, Televisions, etc.)
- Coupons stored only in localStorage (`dharma_admin_coupons`) in AdminPanelPage - NOT persisted to backend
- Admin panel product changes DO use backend snapshot (ProductsContext), but coupon/ad/store changes are localStorage-only
- ProductsContext already has backend sync via `getProductSnapshot`/`saveProductSnapshot`

## Requested Changes (Diff)

### Add
- New `grocery` category (id: `grocery`, label: "GROCERY", labelHindi: "किराना", emoji: "🛒")
- Backend coupon sync: load from `getCouponsSnapshot`, save via `saveCouponsSnapshot` in AdminPanelPage

### Modify
- **CATEGORIES array** in `src/frontend/src/data/sampleData.ts`: Replace all 65+ categories with exactly these 15 (plus "all"):
  1. `fashion` - Fashion / फैशन 👗
  2. `appliances` - Appliances / उपकरण 🧺
  3. `mobile` - Mobiles / मोबाइल 📱
  4. `electronics` - Electronics / इलेक्ट्रॉनिक्स 📺
  5. `smart-gadgets` - Smart Gadgets / स्मार्ट गैजेट ⌚
  6. `home` - Home & Decor / घर सजावट 🏠
  7. `beauty` - Beauty & Personal Care / सौंदर्य 💄
  8. `toys` - Toys & Baby Care / खिलौने 🧸
  9. `food-health` - Food & Health Care / खाना & स्वास्थ्य 🌿
  10. `auto` - Auto Accessories / ऑटो 🚗
  11. `furniture` - Furniture / फर्नीचर 🛋️
  12. `books` - Books & Media / किताबें 📚
  13. `home-service` - Home Services / घरेलू सेवा 🔧
  14. `grocery` - Grocery / किराना 🛒
  15. `sports` - Sport & Fitness / खेल 🏃

- **Category remapping** for all products in sampleData.ts, productsData2.ts, productsData3.ts:
  - `Men's Essentials`, `Woman's clothing`, `Woman footwear & accessories`, `Women's Essentials`, `Kid's Fashion`, `Suitcase, Bags & backpacks` → `fashion`
  - `Air conditioners`, `Refrigerators`, `Washing machines`, `Seasonal appliances`, `Kitchen appliances`, `Home appliances`, `Microwave oven`, `Personal care appliances` → `appliances`
  - `Mobiles` → `mobile`
  - `Televisions`, `Laptops`, `Camera`, `Computer peripheral`, `Computer accessories`, `Storage`, `Headphones & speakers`, `Gaming` → `electronics`
  - `Smart wearables`, `Cases covers & more`, `Mobile accessories`, `Power banks`, `Smart home automation` → `smart-gadgets`
  - `Home improvement tools`, `Decor & lighting`, `Household supplies` → `home`
  - `Skin care`, `Hair care`, `Fragrance`, `Beauty`, `Daily essentials` → `beauty`
  - `Baby care`, `Stationery & school supplies`, `Kids' room furniture` → `toys`
  - `Nutrition & healthcare`, `Health care device` → `food-health`
  - `Bike accessories`, `Car accessories` → `auto`
  - `Bedroom furniture`, `Living room furniture`, `Study & office furniture`, `Dining & kitchen`, `Outdoor furniture`, `Storage furniture`, `Tables` → `furniture`
  - `SportsCycles`, `Exercise bikes`, `Premium Treadmills`, `Fitness accessories`, `Cricket`, `Badminton` → `sports`

- **Add a getCategoryId() mapping function** at the top of sampleData.ts that maps any old category ID to the new 15 IDs. This function should also be applied when loading products from backend storage (in ProductsContext, after loading snapshot, run each product.category through this mapper).

- **AdminPanelPage coupon persistence**: In the `coupons` state section, after `actor` is available, load from `getCouponsSnapshot()` and save to `saveCouponsSnapshot()` whenever coupons change. Wire similarly to how ProductsContext does it.

### Remove
- All extra categories beyond the 15 from the CATEGORIES array (there are currently 65+ entries - remove all sub-categories)

## Implementation Plan
1. Update `CATEGORIES` in `sampleData.ts` - keep only 15 + "all"
2. Add `getCategoryId(oldId: string): string` mapping function in sampleData.ts
3. Bulk-replace all old category values in sampleData.ts products using the mapping
4. Bulk-replace all old category values in productsData2.ts using the mapping
5. Bulk-replace all old category values in productsData3.ts using the mapping
6. In `ProductsContext.tsx`, after loading products from backend snapshot, run each product.category through `getCategoryId()` to normalize categories
7. In `AdminPanelPage.tsx`, add `useActor` hook and backend sync for coupons (load on mount, save on change)
8. Validate and build
