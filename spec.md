# धर्मा Mart - Store Seller Integration

## Current State
- `/admin` page (AdminPage.tsx) has admin login (password: dharma@admin123)
- Stores managed in StoresContext with city/address/phone/pincode/timings
- SampleProduct has no `storeId` field
- No store-owner login or product submission flow

## Requested Changes (Diff)

### Add
- `storeName` and `password` fields to SampleStore interface
- `/store-login` route: Store owner login page (login by city/storeName + password)
- `/store-dashboard` route: Store owner dashboard to add/edit/delete their own products
- Store-submitted products tagged with `storeId` + `storeName` in product data
- In AdminPage.tsx (`/admin`) Products tab: show store-submitted products with "Store: <name>" badge; admin can approve/delete them
- In AdminPage.tsx Stores tab: show each store's password (editable by admin); add 'Store Login' link
- Default store passwords set to `store@dharma123` for all existing stores

### Modify
- SampleStore interface: add `name: string`, `password: string`, `ownerName?: string`
- SampleProduct interface: add optional `storeId?: number`, `storeName?: string`, `storeSubmitted?: boolean`
- ProductsContext: store-submitted products persist separately; merge with all products for display
- SAMPLE_STORES: add `name` and `password` fields
- AdminPage.tsx: in Products tab, show storeSubmitted badge; add "Store Products" filter tab

### Remove
- Nothing removed

## Implementation Plan
1. Update SampleProduct interface to include `storeId`, `storeName`, `storeSubmitted`
2. Update SampleStore interface to include `name`, `password`, `ownerName`
3. Update SAMPLE_STORES with name and default passwords
4. Create StoreDashboardPage.tsx: login form + product management for store owners
5. Create StoreLoginPage.tsx: simple login with storeName + password
6. Update ProductsContext to support store-submitted products
7. Update AdminPage.tsx: show store products with badge in Products tab, allow admin to manage store passwords in Stores tab
8. Add routes in App.tsx
