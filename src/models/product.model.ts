export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  condition?: string;
  availableQuantity?: number;
  soldQuantity?: number;
  description: string;
  images: string[] | ProductImage[];
  specifications?: ProductSpecification[];
  seller: Seller;
  shipping?: ShippingInfo;
  paymentMethods: PaymentMethod[];
  rating?: ProductRating | number;
  breadcrumb?: BreadcrumbItem[];
  stock?: number;
  reviews?: Review[];
  productType?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Seller {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rating?: number;
  reputation?: SellerReputation;
  location?: string;
  isOfficialStore?: boolean;
}

export interface SellerReputation {
  level: string;
  positivePercentage: number;
  totalTransactions: number;
}

export interface ShippingInfo {
  freeShipping: boolean;
  estimatedDays: string;
  methods: string[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'cash' | 'transfer';
  installments?: number;
  icon: string;
}

export interface ProductRating {
  average: number;
  totalReviews: number;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  condition: string;
  freeShipping: boolean;
}

/**
 * Generic interface for paginated responses from the API
 * @template T The type of items in the content array
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasPrevious: boolean;
  hasNext: boolean;
}