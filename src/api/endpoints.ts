export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/api/auth/sign-in/email",
    SIGN_UP: "/api/auth/sign-up/email",
    SIGN_OUT: "/api/auth/sign-out",
    GET_SESSION: "/api/auth/get-session",
  },
  V1: {
    PROFILE: "/api/v1/auth/profile",
    SESSION: "/api/v1/auth/session",
    STORE: "/api/v1/auth/store",
    DASHBOARD_SUMMARY: "/api/v1/dashboard/summary",
    DASHBOARD_ACTIVITIES: "/api/v1/dashboard/activities",
    PRODUCTS: "/api/v1/products",
    PUBLIC_PRODUCTS: "/api/v1/public/products",
    CATEGORIES: "/api/v1/categories",
    INVENTORY: "/api/v1/inventory",
    BUNDLES: "/api/v1/bundles",
    SALES: "/api/v1/sales",
    RETURNS: "/api/v1/returns",
    STAFF: "/api/v1/staff",
    REPORTS: "/api/v1/reports",
    AI: "/api/v1/ai",
    SUBSCRIPTIONS: "/api/v1/subscriptions",
    ADMIN: "/api/v1/admin",
  },
} as const;

