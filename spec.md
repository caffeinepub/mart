# धर्मा Mart

## Current State
- E-commerce site with 9 categories: electronics, appliances, fashion, footwear, toys, furniture, grocery, home, all
- ~24 products in SAMPLE_PRODUCTS
- Admin panel with edit/delete products but NO add product button
- 'All Deals' link bug: when navigating to /products?deals=true from homepage, items disappear if component state is stale
- Category grid on homepage shows limited categories

## Requested Changes (Diff)

### Add
- 6 new categories: mobile, smart-gadgets, beauty, sports, auto, books, home-service
- 30+ new products across all categories with real images and prices
- 'Add Product' button and form dialog in Admin panel Products tab
- Products for: Fashion, Appliance, Mobile, Electronic, Smart Gadgets, Home, Beauty & Personal Care, Toys & Baby Care, Food & Healthcare, Sports & Fitness, Auto Accessories, Furniture, Books, Media, Home Service

### Modify
- Fix deals bug: add useEffect in ProductsPage to sync activeCategory and activeSearch state when URL search params change
- Expand CATEGORIES array with all new categories
- Category display on homepage and products page to show all 15+ categories (scrollable/grid)
- Admin panel Products tab: add 'Add New Product' button and dialog with full form
- Rename 'GARMENTS' category label to 'FASHION'
- Rename 'grocery' category label to 'FOOD & HEALTH'

### Remove
- Nothing removed

## Implementation Plan
1. Update sampleData.ts: expand CATEGORIES array (15+ categories), add 30+ products
2. Fix ProductsPage.tsx: useEffect to sync state from URL search params (fixes deals bug)
3. Update AdminPage.tsx: add 'Add New Product' button and form dialog in Products tab
4. Update HomePage.tsx: make category section scrollable to handle many categories
