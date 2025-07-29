import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Product, RelatedProduct } from '../models/product.model';
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
}