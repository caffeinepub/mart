# धर्मा Mart - Customer Login Panel

## Current State
- Admin panel with product/store management exists
- Backend has basic UserProfile (name only), cart, and orders
- No customer-facing login/registration UI
- Admin panel has no way to see registered customers
- No customer wishlist/addon feature

## Requested Changes (Diff)

### Add
- Customer Login/Register page at `/customer-login` with name, mobile number, and address fields
- Customer Dashboard page at `/my-account` showing their profile, wishlist, and order history
- Wishlist/Add-on feature: customers can save/wishlist products from product pages
- Admin panel: new 'Customers' tab showing all registered customers (name, mobile, address, principal, wishlist)
- Extended backend CustomerProfile type with name, mobile, address fields
- Backend: admin-only getAllCustomers() to list all customer profiles
- Backend: customer wishlist storage and management (addToWishlist, removeFromWishlist, getWishlist)
- Header: 'My Account' button for customers to login/access dashboard

### Modify
- UserProfile type in backend: extend with mobile and address fields
- AdminPage: add Customers tab with table of all registered customers and their wishlists
- Header: add customer login button
- ProductCard/ProductDetailPage: add Wishlist/Add-on heart button for logged-in customers

### Remove
- Nothing removed

## Implementation Plan
1. Update backend: extend CustomerProfile with mobile/address, add wishlist storage, add getAllCustomers for admin, add wishlist CRUD for users
2. Add CustomerLogin page with registration form (name, mobile, address) + Internet Identity login
3. Add CustomerDashboard (/my-account) showing profile, wishlist items, order history
4. Update Header to show My Account / customer login button
5. Add wishlist heart button to ProductCard and ProductDetailPage
6. Update AdminPage to add Customers tab with full customer list and wishlist view
