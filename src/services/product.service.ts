import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Product, RelatedProduct } from '../models/product.model';

// Interface for simplified product search results
export interface ProductSearchResult {
  id: string;
  title: string;
  price: number;
  currency?: string;
  image: string;
  description?: string;
  productType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8085/api';
  
  constructor(private http: HttpClient) { }

  getProduct(id: string): Observable<Product> {
    console.log('Fetching product with ID:', id);
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      map(product => {
        console.log('Raw product from API:', product);
        // Process image paths if they exist
        if (product.images && product.images.length > 0) {
          console.log('Processing images:', product.images);
          product.images = this.processImagePaths(product.images);
          console.log('Processed images:', product.images);
        }
        return product;
      })
    );
  }
  
  /**
   * Process image paths from the backend
   * - Keep the leading slashes to ensure correct path resolution
   * - Fix invalid extensions (e.g., .html)
   * @param images Array of image paths or ProductImage objects
   * @returns Processed array of image paths or ProductImage objects
   */
  private processImagePaths(images: string[] | any[]): string[] | any[] {
    return images.map(image => {
      if (typeof image === 'string') {
        // Keep the leading slash to ensure correct path resolution
        let processedPath = image;
        
        // Fix invalid extensions (e.g., .html -> .jpg)
        if (processedPath.endsWith('.html')) {
          processedPath = processedPath.replace('.html', '.jpg');
        }
        
        return processedPath;
      } else if (image && image.url) {
        // Handle ProductImage objects
        let processedUrl = image.url;
        
        // Fix invalid extensions
        if (processedUrl.endsWith('.html')) {
          processedUrl = processedUrl.replace('.html', '.jpg');
        }
        
        return {
          ...image,
          url: processedUrl
        };
      }
      
      return image;
    });
  }
  
  /**
   * Get all products from the API
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]); // Return empty array on error
      })
    );
  }
  
  /**
   * Search products based on a query string
   * @param query The search query
   * @returns Observable of simplified product search results
   */
  searchProducts(query: string): Observable<ProductSearchResult[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Call the dedicated search API endpoint
    console.log(`Searching products with query: ${normalizedQuery}`);
    return this.http.get<Product[]>(`${this.apiUrl}/products/search?q=${encodeURIComponent(normalizedQuery)}`).pipe(
      map(products => {
        console.log(`Found ${products.length} products matching query: ${normalizedQuery}`);
        // Map to simplified search results
        return products
          .map(product => this.mapToSearchResult(product))
          // Limit to 5 results for better UX
          .slice(0, 5);
      }),
      catchError(error => {
        console.error(`Error searching products with query: ${normalizedQuery}`, error);
        
        // Fallback to client-side filtering if the API fails
        console.log('Falling back to client-side search');
        return this.getAllProducts().pipe(
          map(products => {
            // Filter products that match the query
            return products
              .filter(product => 
                product.title.toLowerCase().includes(normalizedQuery) || 
                (product.description && product.description.toLowerCase().includes(normalizedQuery)) ||
                (product.seller && product.seller.name.toLowerCase().includes(normalizedQuery))
              )
              // Map to simplified search results
              .map(product => this.mapToSearchResult(product))
              // Limit to 5 results for better UX
              .slice(0, 5);
          })
        );
      })
    );
  }
  
  /**
   * Map a full Product to a simplified ProductSearchResult
   */
  private mapToSearchResult(product: Product): ProductSearchResult {
    // Get the first image URL
    let imageUrl = '';
    if (product.images && product.images.length > 0) {
      if (typeof product.images[0] === 'string') {
        imageUrl = product.images[0] as string;
      } else {
        imageUrl = (product.images[0] as any).url || '';
      }
    }
    
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency || 'US$',
      image: imageUrl,
      description: product.description ? product.description.substring(0, 100) + '...' : undefined,
      productType: product.productType
    };
  }
  
  /**
   * This method should be used only as a fallback when the API fails
   * Instead of using hardcoded mock data, it tries to fetch the product from the API
   * with a different endpoint or approach
   */
  getMockProduct(id: string): Observable<Product> {
    console.log('Fetching mock product with ID:', id);
    // Try to get the product from a different endpoint or with a different approach
    return this.http.get<Product>(`${this.apiUrl}/products/mock/${id}`).pipe(
      map(product => {
        console.log('Raw mock product from API:', product);
        // Process image paths if they exist
        if (product.images && product.images.length > 0) {
          console.log('Processing mock images:', product.images);
          product.images = this.processImagePaths(product.images);
          console.log('Processed mock images:', product.images);
        }
        return product;
      }),
      catchError(error => {
        console.error('Error fetching mock product:', error);
        // Return a basic mock product as a last resort
        return of({
          id: id,
          title: 'Product Not Available',
          price: 0,
          description: 'This product is currently not available.',
          images: [],
          stock: 0,
          availableQuantity: 0,
          seller: {
            id: '0',
            name: 'Unknown Seller',
            isOfficialStore: false
          },
          reviews: [],
          productType: 'Unknown',
          paymentMethods: [
            {
              id: 'default',
              name: 'Default Payment Method',
              type: 'card' as 'card', // Explicitly type as 'card' to satisfy PaymentMethod interface
              icon: '💳'
            }
          ]
        });
      })
    );
  }

  /**
   * @deprecated Use getProductsByType instead. This method is kept for backward compatibility.
   * According to the API documentation, we should use /products/type/{type} endpoint instead of /products/related.
   */
  getRelatedProducts(): Observable<RelatedProduct[]> {
    console.warn('getRelatedProducts is deprecated. Use getProductsByType instead.');
    // Use a default type like "featured" or return empty array
    return of([]);
  }

  /**
   * Get products by type from the API
   * @param type The product type to filter by (e.g., 'celular', 'televisor')
   * @returns Observable of related products of the specified type
   */
  getProductsByType(type: string): Observable<RelatedProduct[]> {
    if (!type || type.trim() === '') {
      console.warn('No product type provided for getProductsByType');
      return of([]);
    }

    console.log(`Fetching products with type: ${type}`);
    // Fetch products by type from the backend API
    return this.http.get<RelatedProduct[]>(`${this.apiUrl}/products/type/${encodeURIComponent(type)}`).pipe(
      map(products => {
        console.log(`Found ${products.length} products of type ${type}`);
        // Process image paths in related products
        return products.map(product => {
          if (product.image) {
            // Fix invalid extensions
            if (product.image.endsWith('.html')) {
              product.image = product.image.replace('.html', '.jpg');
            }
          }
          return product;
        });
      }),
      catchError(error => {
        console.error(`Error fetching products of type ${type}:`, error);
        // Return empty array on error
        return of([]);
      })
    );
  }
}