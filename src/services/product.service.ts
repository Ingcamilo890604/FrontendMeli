import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Product, RelatedProduct } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';
import { ImageProcessingService } from './image-processing.service';
import { UI, APP } from '../constants';

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
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProcessingService: ImageProcessingService
  ) { }

  getProduct(id: string): Observable<Product> {
    return this.productRepository.getProduct(id).pipe(
      map(product => {
        if (product.images && product.images.length > 0) {
          product.images = this.imageProcessingService.processImagePaths(product.images);
        }
        return product;
      })
    );
  }
  
  getAllProducts(): Observable<Product[]> {
    return this.productRepository.getAllProducts();
  }
  
  searchProducts(query: string): Observable<ProductSearchResult[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    return this.productRepository.searchProducts(query).pipe(
      map(products => {
        return products
          .map(product => this.mapToSearchResult(product))
          .slice(0, UI.SEARCH.MAX_RESULTS);
      })
    );
  }
  
  private mapToSearchResult(product: Product): ProductSearchResult {
    let imageUrl = '';
    if (product.images && product.images.length > 0) {
      if (typeof product.images[0] === 'string') {
        imageUrl = product.images[0];
      } else {
        imageUrl = (product.images[0] as any).url || '';
      }
    }
    
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency || APP.DEFAULTS.CURRENCY,
      image: imageUrl,
      description: product.description ? product.description.substring(0, UI.SEARCH.DESCRIPTION_PREVIEW_LENGTH) + '...' : undefined,
      productType: product.productType
    };
  }
  
  getMockProduct(id: string): Observable<Product> {
    return this.productRepository.getMockProduct(id).pipe(
      map(product => {
        if (product.images && product.images.length > 0) {
          product.images = this.imageProcessingService.processImagePaths(product.images);
        }
        return product;
      })
    );
  }

  getRelatedProducts(): Observable<RelatedProduct[]> {
    return of([]);
  }

  getProductsByType(type: string): Observable<RelatedProduct[]> {
    if (!type || type.trim() === '') {
      return of([]);
    }

    return this.productRepository.getProductsByType(type).pipe(
      map(products => {
        return products.map(product => {
          if (product.image) {
            product.image = this.imageProcessingService.processRelatedProductImage(product.image);
          }
          return product;
        });
      })
    );
  }
}