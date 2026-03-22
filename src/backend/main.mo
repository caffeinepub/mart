import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Int "mo:core/Int";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Unique ID generator
  var nextProductId = 0;

  func getNextProductId() : Nat {
    let id = nextProductId;
    nextProductId += 1;
    id;
  };

  // Product Storage
  type Price = Nat;

  type Product = {
    name : Text;
    description : Text;
    price : Price;
    category : Text;
    image : ?Storage.ExternalBlob;
    isFeatured : Bool;
    isDeal : Bool;
    stock : Nat;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };
  };

  let products = Map.empty<Nat, Product>();

  func getSortedProducts() : [Product] {
    products.values().toArray().sort();
  };

  // Store Storage
  type Store = {
    city : Text;
    address : Text;
    phone : Text;
    pincode : Text;
  };

  module Store {
    public func compare(store1 : Store, store2 : Store) : Order.Order {
      switch (Text.compare(store1.city, store2.city)) {
        case (#equal) { store1.address.compare(store2.address) };
        case (order) { order };
      };
    };
  };

  // Order Storage
  type Order = {
    id : Nat;
    userId : Principal;
    products : [Product];
    totalPrice : Price;
    timestamp : Int;
  };

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 0;

  func getNextOrderId() : Nat {
    let id = nextOrderId;
    nextOrderId += 1;
    id;
  };

  // Cart Storage
  let carts = Map.empty<Principal, List.List<Product>>();

  // Store Locations
  let stores = Map.empty<Nat, Store>();
  var nextStoreId = 0;
  func getNextStoreId() : Nat {
    let id = nextStoreId;
    nextStoreId += 1;
    id;
  };

  /////////////////////////////
  // Snapshot Storage (Admin Panel Persistence)
  /////////////////////////////
  var productSnapshot : Text = "";
  var storeSnapshot : Text = "";
  var customerSnapshot : Text = "";
  var reviewsSnapshot : Text = "";
  var ordersSnapshot : Text = "";
  var couponsSnapshot : Text = "";
  var analyticsSnapshot : Text = "";

  public query func getProductSnapshot() : async Text { productSnapshot };
  public func saveProductSnapshot(data : Text) : async () { productSnapshot := data };

  public query func getStoreSnapshot() : async Text { storeSnapshot };
  public func saveStoreSnapshot(data : Text) : async () { storeSnapshot := data };

  public query func getCustomerSnapshot() : async Text { customerSnapshot };
  public func saveCustomerSnapshot(data : Text) : async () { customerSnapshot := data };

  public query func getReviewsSnapshot() : async Text { reviewsSnapshot };
  public func saveReviewsSnapshot(data : Text) : async () { reviewsSnapshot := data };

  public query func getOrdersSnapshot() : async Text { ordersSnapshot };
  public func saveOrdersSnapshot(data : Text) : async () { ordersSnapshot := data };

  public query func getCouponsSnapshot() : async Text { couponsSnapshot };
  public func saveCouponsSnapshot(data : Text) : async () { couponsSnapshot := data };

  public query func getAnalyticsSnapshot() : async Text { analyticsSnapshot };
  public func saveAnalyticsSnapshot(data : Text) : async () { analyticsSnapshot := data };

  /////////////////////////////
  // Product Management ///////
  /////////////////////////////
  public shared ({ caller }) func createProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = getNextProductId();
    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(productId : Nat, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.add(productId, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    getSortedProducts();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    getSortedProducts().values().filter(func(p) { p.isFeatured }).toArray();
  };

  public query ({ caller }) func getDealProducts() : async [Product] {
    getSortedProducts().values().filter(func(p) { p.isDeal }).toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    getSortedProducts().values().filter(func(p) { p.category == category }).toArray();
  };

  public query ({ caller }) func getProductPagination(page : Nat, pageSize : Nat) : async [Product] {
    let allProducts = getSortedProducts();
    let start = page * pageSize;
    let end = Nat.min(start + pageSize, allProducts.size());
    allProducts.sliceToArray(start, end);
  };

  func searchProducts(searchTerm : Text) : Iter.Iter<Product> {
    products.values().filter(
      func(p) {
        p.name.toLower().contains(#text(searchTerm.toLower()));
      }
    );
  };

  public query ({ caller }) func getSearchProducts(searchTerm : Text) : async [Product] {
    searchProducts(searchTerm).toArray();
  };

  public query ({ caller }) func getSearchProductsPagination(searchTerm : Text, page : Nat, pageSize : Nat) : async [Product] {
    let filteredProducts = searchProducts(searchTerm).toArray();
    let start = page * pageSize;
    let end = Nat.min(start + pageSize, filteredProducts.size());
    filteredProducts.sliceToArray(start, end);
  };

  /////////////////////////////
  // Cart Management //////////
  /////////////////////////////
  public shared ({ caller }) func getCallerCart() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    let cart = carts.get(caller);
    switch (cart) {
      case (null) { [] };
      case (?products) { products.toArray() };
    };
  };

  public shared ({ caller }) func addToCallerCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify cart");
    };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    let cart = switch (carts.get(caller)) {
      case (null) { List.empty<Product>() };
      case (?c) { c };
    };
    cart.add(product);
    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCallerCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify cart");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?c) { c };
    };
    let filteredList = cart.filter(
      func(x) { x.name != productId.toText() }
    );
    carts.add(caller, filteredList);
  };

  public shared ({ caller }) func clearCallerCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify cart");
    };
    carts.remove(caller);
  };

  public shared ({ caller }) func checkoutCallerCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };
    carts.remove(caller);
  };

  /////////////////////////////
  // Order Management /////////
  /////////////////////////////
  public shared ({ caller }) func placeOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?c) { c };
    };
    let cartProducts = cart.toArray();
    if (cartProducts.size() == 0) { Runtime.trap("Cart is empty") };
    let totalPrice = cartProducts.foldLeft(
      0,
      func(acc, p) { acc + p.price },
    );
    let orderId = getNextOrderId();
    let order : Order = {
      id = orderId;
      userId = caller;
      products = cartProducts;
      totalPrice = totalPrice;
      timestamp = 0;
    };
    orders.add(orderId, order);
    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getCallerOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().filter(func(o) { o.userId == caller }).toArray();
  };

  /////////////////////////////
  // Store Management /////////
  /////////////////////////////
  public query ({ caller }) func getAllStores() : async [Store] {
    stores.values().toArray().sort();
  };

  public shared ({ caller }) func addStore(store : Store) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = getNextStoreId();
    stores.add(id, store);
    id;
  };

  public shared ({ caller }) func updateStore(storeId : Nat, store : Store) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not stores.containsKey(storeId)) {
      Runtime.trap("Store not found");
    };
    stores.add(storeId, store);
  };

  public shared ({ caller }) func deleteStore(storeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not stores.containsKey(storeId)) {
      Runtime.trap("Store not found");
    };
    stores.remove(storeId);
  };
};
