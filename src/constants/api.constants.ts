/**
 * API-related constants
 */

export const API = {
  BASE_URL: 'http://localhost:8085/api',
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    PRODUCT_SEARCH: '/products/search',
    PRODUCT_MOCK: (id: string) => `/products/mock/${id}`,
    PRODUCTS_BY_TYPE: (type: string) => `/products/type/${encodeURIComponent(type)}`,
    // Pagination endpoints
    PRODUCTS_PAGE: '/products/page',
    PRODUCTS_BY_TYPE_PAGE: (type: string) => `/products/type/${encodeURIComponent(type)}/page`
  }
};