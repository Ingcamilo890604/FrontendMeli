import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Product, RelatedProduct } from '../models/product.model';
import { ProductRepository } from './product.repository';

@Injectable({
  providedIn: 'root'
})
export class ProductHttpRepository extends ProductRepository {
  private readonly apiUrl = 'http://localhost:8085/api';
  
  constructor(private readonly http: HttpClient) {
    super();
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
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
    
    return this.http.get<Product[]>(`${this.apiUrl}/products/search?q=${encodeURIComponent(normalizedQuery)}`).pipe(
      catchError(error => {
        return this.getAllProducts();
      })
    );
  }
  
  getMockProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/mock/${id}`).pipe(
      catchError(error => {
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
              type: 'card',
              icon: '💳'
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

    return this.http.get<RelatedProduct[]>(`${this.apiUrl}/products/type/${encodeURIComponent(type)}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }
}