import { Injectable } from '@angular/core';
import { ProductImage } from '../models/product.model';

/**
 * Service dedicated to image processing operations
 * This centralizes all image-related logic that was previously scattered across different components
 */
@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {
  constructor() { }

  /**
   * Process image paths from the backend
   * - Fix invalid extensions (e.g., .html)
   * @param images Array of image paths or ProductImage objects
   * @returns Processed array of image paths or ProductImage objects
   */
  processImagePaths(images: string[] | any[]): string[] | any[] {
    if (!images || images.length === 0) {
      return [];
    }

    return images.map(image => {
      if (typeof image === 'string') {
        // Fix invalid extensions (e.g., .html -> .jpg)
        let processedPath = image;
        
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
   * Convert string image URLs to ProductImage objects
   * @param images Array of image URLs as strings
   * @param productTitle Product title for alt text
   * @returns Array of ProductImage objects
   */
  convertToProductImageObjects(images: string[], productTitle: string = 'Product'): ProductImage[] {
    if (!images || images.length === 0) {
      return [];
    }

    return images.map((url: string, index: number) => ({
      id: index.toString(),
      url: url,
      alt: `${productTitle} - Image ${index + 1}`
    }));
  }

  /**
   * Process a single image URL for related products
   * @param imageUrl The image URL to process
   * @returns Processed image URL
   */
  processRelatedProductImage(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }
    
    // Fix invalid extensions
    if (imageUrl.endsWith('.html')) {
      return imageUrl.replace('.html', '.jpg');
    }
    
    return imageUrl;
  }
}