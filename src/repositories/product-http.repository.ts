import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { Product, RelatedProduct, Page } from '../models/product.model';
import { ProductRepository } from './product.repository';
import { API, APP } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ProductHttpRepository extends ProductRepository {
  private readonly apiUrl = API.BASE_URL;
  
  constructor(private readonly http: HttpClient) {
    super();
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${API.ENDPOINTS.PRODUCT_BY_ID(id)}`);
  }
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}${API.ENDPOINTS.PRODUCTS}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }
  
  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return this.http.get<Product[]>(`${this.apiUrl}${API.ENDPOINTS.PRODUCT_SEARCH}?q=${encodeURIComponent(normalizedQuery)}`).pipe(
      catchError(error => {
        return this.getAllProducts();
      })
    );
  }
  
  getMockProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${API.ENDPOINTS.PRODUCT_MOCK(id)}`).pipe(
      catchError(error => {
        return of({
          id: id,
          title: APP.DEFAULTS.MOCK_PRODUCT.TITLE,
          price: 0,
          description: APP.DEFAULTS.MOCK_PRODUCT.DESCRIPTION,
          images: [],
          stock: 0,
          availableQuantity: 0,
          seller: {
            id: APP.DEFAULTS.MOCK_PRODUCT.SELLER_ID,
            name: APP.DEFAULTS.MOCK_PRODUCT.SELLER_NAME,
            isOfficialStore: false
          },
          reviews: [],
          productType: APP.DEFAULTS.MOCK_PRODUCT.PRODUCT_TYPE,
          paymentMethods: [
            {
              id: APP.DEFAULTS.MOCK_PRODUCT.PAYMENT_METHOD_ID,
              name: APP.DEFAULTS.MOCK_PRODUCT.PAYMENT_METHOD_NAME,
              type: 'card' as const,
              icon: APP.DEFAULTS.PAYMENT_METHODS.ICONS.CARD
            }
          ]
        });
      })
    );
  }
  
  getProductsByType(type: string): Observable<RelatedProduct[]> {
    if (!type || type.trim() === '') {
      return of([]);
    }

    return this.http.get<RelatedProduct[]>(`${this.apiUrl}${API.ENDPOINTS.PRODUCTS_BY_TYPE(type)}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }
  
  getProductsPage(page: number, size: number): Observable<Page<Product>> {
    // Ensure page and size are valid numbers
    const validPage = Math.max(0, page || 0);
    const validSize = Math.max(1, size || 10);
    
    return this.http.get<Page<Product>>(
      `${this.apiUrl}${API.ENDPOINTS.PRODUCTS_PAGE}?page=${validPage}&size=${validSize}`
    ).pipe(
      catchError(error => {
        // Return an empty page on error
        return of({
          content: [],
          totalElements: 0,
          totalPages: 0,
          page: validPage,
          size: validSize,
          hasPrevious: false,
          hasNext: false
        });
      })
    );
  }
  
  getProductsByTypePage(type: string, page: number, size: number): Observable<Page<RelatedProduct>> {
    if (!type || type.trim() === '') {
      // Return an empty page if type is empty
      return of({
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: page || 0,
        size: size || 10,
        hasPrevious: false,
        hasNext: false
      });
    }
    
    // Ensure page and size are valid numbers
    const validPage = Math.max(0, page || 0);
    const validSize = Math.max(1, size || 10);
    
    return this.http.get<Page<RelatedProduct>>(
      `${this.apiUrl}${API.ENDPOINTS.PRODUCTS_BY_TYPE_PAGE(type)}?page=${validPage}&size=${validSize}`
    ).pipe(
      catchError(error => {
        // Return an empty page on error
        return of({
          content: [],
          totalElements: 0,
          totalPages: 0,
          page: validPage,
          size: validSize,
          hasPrevious: false,
          hasNext: false
        });
      })
    );
  }
  
  searchProductsPage(query: string, page: number, size: number): Observable<Page<Product>> {
    if (!query || query.trim() === '') {
      // Return an empty page if query is empty
      return of({
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: page || 0,
        size: size || 10,
        hasPrevious: false,
        hasNext: false
      });
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Ensure page and size are valid numbers
    const validPage = Math.max(0, page || 0);
    const validSize = Math.max(1, size || 10);
    
    // Since we don't have a dedicated paginated search endpoint,
    // we'll use the general paginated endpoint and filter the results
    return this.http.get<Page<Product>>(
      `${this.apiUrl}${API.ENDPOINTS.PRODUCTS_PAGE}?page=${validPage}&size=${validSize}`
    ).pipe(
      map(productPage => {
        // Filter products based on the search query
        const filteredContent = productPage.content.filter(product => {
          // Search in title, description, and productType
          return (
            product.title.toLowerCase().includes(normalizedQuery) ||
            (product.description && product.description.toLowerCase().includes(normalizedQuery)) ||
            (product.productType && product.productType.toLowerCase().includes(normalizedQuery))
          );
        });
        
        // Calculate new pagination values based on filtered results
        const totalElements = filteredContent.length;
        const totalPages = Math.ceil(totalElements / validSize);
        const hasPrevious = validPage > 0;
        const hasNext = validPage < totalPages - 1;
        
        // Return a new page object with the filtered content
        return {
          content: filteredContent,
          totalElements,
          totalPages,
          page: validPage,
          size: validSize,
          hasPrevious,
          hasNext
        };
      }),
      catchError(error => {
        // Return an empty page on error
        return of({
          content: [],
          totalElements: 0,
          totalPages: 0,
          page: validPage,
          size: validSize,
          hasPrevious: false,
          hasNext: false
        });
      })
    );
  }
}