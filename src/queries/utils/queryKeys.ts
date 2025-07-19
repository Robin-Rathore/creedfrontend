// Query key factory for consistent key management
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    profile: ["users", "profile"] as const,
    addresses: ["users", "addresses"] as const,
    cart: ["users", "cart"] as const,
    wishlist: ["users", "wishlist"] as const,
    orders: (params?: any) => ["users", "orders", params] as const,
    order: (id: string) => ["users", "orders", id] as const,
  },

  // Products
  products: {
    all: (params?: any) => ["products", params] as const,
    featured: (limit?: number) => ["products", "featured", limit] as const,
    latest: (limit?: number) => ["products", "latest", limit] as const,
    bestSelling: (limit?: number) => ["products", "best-selling", limit] as const,
    topRated: (limit?: number) => ["products", "top-rated", limit] as const,
    search: (query: string, params?: any) => ["products", "search", query, params] as const,
    detail: (id: string) => ["products", id] as const,
    bySlug: (slug: string) => ["products", "slug", slug] as const,
    related: (id: string, limit?: number) => ["products", id, "related", limit] as const,
    reviews: (id: string, params?: any) => ["products", id, "reviews", params] as const,
    reviewStats: (id: string) => ["products", id, "reviews", "stats"] as const,
  },

  // Categories
  categories: {
    all: (params?: any) => ["categories", params] as const,
    tree: ["categories", "tree"] as const,
    detail: (id: string) => ["categories", id] as const,
    bySlug: (slug: string) => ["categories", "slug", slug] as const,
    products: (id: string, params?: any) => ["categories", id, "products", params] as const,
  },

  // Orders
  orders: {
    all: (params?: any) => ["orders", params] as const,
    detail: (id: string) => ["orders", id] as const,
    stats: (period?: string) => ["orders", "stats", period] as const,
  },

  // Reviews
  reviews: {
    all: (params?: any) => ["reviews", params] as const,
    detail: (id: string) => ["reviews", id] as const,
  },

  // Coupons
  coupons: {
    all: (params?: any) => ["coupons", params] as const,
    active: ["coupons", "active"] as const,
    detail: (id: string) => ["coupons", id] as const,
    stats: (id: string) => ["coupons", id, "stats"] as const,
  },

  // Admin
  admin: {
    dashboard: ["admin", "dashboard"] as const,
    users: (params?: any) => ["admin", "users", params] as const,
    salesAnalytics: (period?: string) => ["admin", "analytics", "sales", period] as const,
    inventoryAnalytics: ["admin", "analytics", "inventory"] as const,
  },
} as const
