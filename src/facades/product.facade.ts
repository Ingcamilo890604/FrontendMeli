import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product, RelatedProduct, PaymentMethod } from '../models/product.model';
import { ProductService, ProductSearchResult } from '../services/product.service';
import { ImageProcessingService } from '../services/image-processing.service';

/**
 * Facade for product-related operations
 * This class simplifies the interaction between components and the ProductService
 */
@Injectable({
  providedIn: 'root'
})
export class ProductFacade {
  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService
  ) { }

  /**
   * Get a product by ID
   * @param id The product ID
   * @returns Observable of Product
   */
  getProduct(id: string): Observable<Product> {
    return this.productService.getProduct(id);
  }

  /**
   * Get products by type
   * @param type The product type
   * @returns Observable of RelatedProduct array
   */
  getRelatedProducts(type: string): Observable<RelatedProduct[]> {
    return this.productService.getProductsByType(type);
  }

  /**
   * Search products based on a query string
   * @param query The search query
   * @returns Observable of ProductSearchResult array
   */
  searchProducts(query: string): Observable<ProductSearchResult[]> {
    return this.productService.searchProducts(query);
  }

  /**
   * Process product data to ensure it has all required fields
   * @param product The product to process
   * @returns The processed product
   */
  processProductData(product: Product): Product {
    if (!product) return product;

    // Create a copy of the product to avoid modifying the original
    const processedProduct = { ...product };

    this.ensureBreadcrumb(processedProduct);
    this.ensureAvailableQuantity(processedProduct);
    this.ensureCurrency(processedProduct);
    this.calculateRatingFromReviews(processedProduct);
    this.processImages(processedProduct);
    this.ensurePaymentMethods(processedProduct);

    return processedProduct;
  }

  /**
   * Ensure product has breadcrumb data
   * @param product The product to process
   */
  private ensureBreadcrumb(product: Product): void {
    if (!product.breadcrumb) {
      product.breadcrumb = [
        { label: 'Inicio', url: '/' },
        { label: product.title || 'Product Details' }
      ];
    }
  }

  /**
   * Ensure product has available quantity data
   * @param product The product to process
   */
  private ensureAvailableQuantity(product: Product): void {
    if (product.stock && !product.availableQuantity) {
      product.availableQuantity = product.stock;
    }
  }

  /**
   * Ensure product has currency data
   * @param product The product to process
   */
  private ensureCurrency(product: Product): void {
    if (!product.currency) {
      product.currency = 'US$';
    }
  }

  /**
   * Calculate rating from reviews if rating is not provided
   * @param product The product to process
   */
  private calculateRatingFromReviews(product: Product): void {
    if (product.reviews && product.reviews.length > 0 && !product.rating) {
      const totalRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      product.rating = {
        average: totalRating / product.reviews.length,
        totalReviews: product.reviews.length
      };
    }
  }

  /**
   * Process images to ensure they are in the correct format
   * @param product The product to process
   */
  private processImages(product: Product): void {
    if (product.images && product.images.length > 0) {
      if (typeof product.images[0] === 'string') {
        // Cast to string[] to ensure correct typing
        const stringImages = product.images as string[];
        product.images = this.imageProcessingService.convertToProductImageObjects(
          stringImages, 
          product.title || 'Product'
        );
      } else {
        // Process existing ProductImage objects
        product.images = this.imageProcessingService.processImagePaths(product.images);
      }
    }
  }

  /**
   * Ensure product has payment methods
   * @param product The product to process
   */
  private ensurePaymentMethods(product: Product): void {
    if (!product.paymentMethods || product.paymentMethods.length === 0) {
      product.paymentMethods = this.getDefaultPaymentMethods();
    }
  }

  /**
   * Get default payment methods
   * @returns Array of default payment methods
   */
  private getDefaultPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'visa',
        name: 'Visa',
        type: 'card',
        installments: 12,
        icon: '💳'
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        type: 'card',
        installments: 12,
        icon: '💳'
      },
      {
        id: 'amex',
        name: 'American Express',
        type: 'card',
        installments: 6,
        icon: '💳'
      },
      {
        id: 'cash',
        name: 'Efectivo',
        type: 'cash',
        installments: 1,
        icon: '💵'
      }
    ];
  }

  /**
   * Split the product description into paragraphs
   * @param description The product description
   * @returns Array of description paragraphs
   */
  getDescriptionParagraphs(description: string | undefined): string[] {
    if (!description) return [];
    return description.split('\n\n').filter(p => p.trim().length > 0);
  }
}