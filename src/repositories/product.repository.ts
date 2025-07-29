import { Observable } from 'rxjs';
import { Product, RelatedProduct } from '../models/product.model';
import { ProductSearchResult } from '../services/product.service';

/**
 * Repository abstract class for product data access
 * This class defines the contract for accessing product data
 * Using an abstract class instead of an interface allows it to be used as a DI token
 */
export abstract class ProductRepository {
  /**
   * Get a product by ID
   * @param id The product ID
   * @returns Observable of Product
   */
  abstract getProduct(id: string): Observable<Product>;
  
  /**
   * Get all products
   * @returns Observable of Product array
   */
  abstract getAllProducts(): Observable<Product[]>;
  
  /**
   * Search products based on a query string
   * @param query The search query
   * @returns Observable of Product array
   */
  abstract searchProducts(query: string): Observable<Product[]>;
  
  /**
   * Get a mock product when the API fails
   * @param id The product ID
   * @returns Observable of Product
   */
  abstract getMockProduct(id: string): Observable<Product>;
  
  /**
   * Get products by type
   * @param type The product type
   * @returns Observable of RelatedProduct array
   */
  abstract getProductsByType(type: string): Observable<RelatedProduct[]>;
}