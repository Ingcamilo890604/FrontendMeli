import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Product, RelatedProduct, Page } from '../models/product.model';
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
  
  /**
   * Search products with pagination
   * @param query The search query
   * @param page The page number (0-based)
   * @param size The page size
   * @returns Observable of Page<ProductSearchResult>
   */
  searchProductsPage(query: string, page: number, size: number): Observable<Page<ProductSearchResult>> {
    if (!query || query.trim() === '') {
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
    
    return this.productRepository.searchProductsPage(query, page, size).pipe(
      map(productPage => {
        // Map each product to a ProductSearchResult
        const mappedContent = productPage.content.map(product => this.mapToSearchResult(product));
        
        // Return a new page object with the mapped content
        return {
          ...productPage,
          content: mappedContent
        };
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
  
  /**
   * Get a page of products with pagination
   * @param page The page number (0-based)
   * @param size The page size
   * @returns Observable of Page<Product>
   */
  getProductsPage(page: number, size: number): Observable<Page<Product>> {
    return this.productRepository.getProductsPage(page, size).pipe(
      map(productPage => {
        // Process images for each product in the page
        const processedContent = productPage.content.map(product => {
          if (product.images && product.images.length > 0) {
            product.images = this.imageProcessingService.processImagePaths(product.images);
          }
          return product;
        });
        
        // Return a new page object with the processed content
        return {
          ...productPage,
          content: processedContent
        };
      })
    );
  }
  
  /**
   * Get a page of products by type with pagination
   * @param type The product type
   * @param page The page number (0-based)
   * @param size The page size
   * @returns Observable of Page<RelatedProduct>
   */
  getProductsByTypePage(type: string, page: number, size: number): Observable<Page<RelatedProduct>> {
    if (!type || type.trim() === '') {
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
    
    return this.productRepository.getProductsByTypePage(type, page, size).pipe(
      map(productPage => {
        // Process images for each product in the page
        const processedContent = productPage.content.map(product => {
          if (product.image) {
            product.image = this.imageProcessingService.processRelatedProductImage(product.image);
          }
          return product;
        });
        
        // Return a new page object with the processed content
        return {
          ...productPage,
          content: processedContent
        };
      })
    );
  }
}