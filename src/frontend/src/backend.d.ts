import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    name: string;
    description: string;
    isDeal: boolean;
    stock: bigint;
    isFeatured: boolean;
    category: string;
    image?: ExternalBlob;
    price: Price;
}
export type Price = bigint;
export interface Order {
    id: bigint;
    userId: Principal;
    timestamp: bigint;
    products: Array<Product>;
    totalPrice: Price;
}
export interface UserProfile {
    name: string;
}
export interface Store {
    city: string;
    address: string;
    phone: string;
    pincode: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStore(store: Store): Promise<bigint>;
    addToCallerCart(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkoutCallerCart(): Promise<void>;
    clearCallerCart(): Promise<void>;
    createProduct(product: Product): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    deleteStore(storeId: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllStores(): Promise<Array<Store>>;
    getCallerCart(): Promise<Array<Product>>;
    getCallerOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDealProducts(): Promise<Array<Product>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductPagination(page: bigint, pageSize: bigint): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getSearchProducts(searchTerm: string): Promise<Array<Product>>;
    getSearchProductsPagination(searchTerm: string, page: bigint, pageSize: bigint): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(): Promise<bigint>;
    removeFromCallerCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(productId: bigint, product: Product): Promise<void>;
    updateStore(storeId: bigint, store: Store): Promise<void>;
}
