import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, RelatedProduct } from '../../models/product.model';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { SellerInfoComponent } from '../seller-info/seller-info.component';
import { ProductSpecificationsComponent } from '../product-specifications/product-specifications.component';
import { RelatedProductsComponent } from '../related-products/related-products.component';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ProductGalleryComponent,
    ProductInfoComponent,
    SellerInfoComponent,
    ProductSpecificationsComponent,
    RelatedProductsComponent,
    ReviewsComponent
  ],
  template: `
    <div class="product-detail-container">
      <div class="container">
        <app-breadcrumb [items]="product?.breadcrumb || []"></app-breadcrumb>
        
        <div class="product-layout">
          <div class="main-column">
            <div class="product-gallery">
              <app-product-gallery [images]="product?.images || []"></app-product-gallery>
            </div>
            <div class="color-selection-container" *ngIf="product">
              <h4>Color: azul oscuro</h4>
              <div class="color-options">
                <div class="color-option active" style="background-color: #1a1a2e;"></div>
                <div class="color-option" style="background-color: #4a4a6e;"></div>
                <div class="color-option" style="background-color: #7a7a9e;"></div>
              </div>
            </div>
            <!-- Product Description Section - moved below product image -->
            <div class="product-description-container">
              <h2>Descripción</h2>
              <div class="description-content">
                @if (product?.description) {
                  @for (paragraph of getDescriptionParagraphs(); track $index) {
                    <p>{{ paragraph }}</p>
                  }
                } @else {
                  <p>Último modelo con características avanzadas y diseño moderno.</p>
                }
              </div>
            </div>
          </div>
          
          <div class="info-column">
            <div class="product-info-wrapper">
              <app-product-info [product]="product"></app-product-info>
            </div>
            <div class="seller-info-wrapper">
              <app-seller-info [product]="product"></app-seller-info>
            </div>
            <!-- Only show specifications if they exist -->
            <div class="product-specs-wrapper" *ngIf="product && product.specifications && product.specifications.length > 0">
              <app-product-specifications [product]="product"></app-product-specifications>
            </div>
          </div>
        </div>
        <!-- Use a safe approach that satisfies the type checker -->
        @if (product && product.reviews && product.reviews.length > 0) {
          <app-reviews [reviews]="product.reviews"></app-reviews>
        }
        <app-related-products [products]="relatedProducts"></app-related-products>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .product-layout {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .main-column {
      flex: 0 0 60%; /* Takes up 60% of the width */
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 600px; /* Ensure minimum height for the column */
      height: 100%; /* Allow it to grow with content */
    }
    
    .info-column {
      flex: 0 0 calc(40% - 20px); /* Takes up 40% of the width, accounting for gap */
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .product-gallery {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .color-selection-container {
      padding: 15px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 15px;
    }
    
    .color-selection-container h4 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 16px;
      color: #333;
    }
    
    .color-options {
      display: flex;
      gap: 10px;
    }
    
    .color-option {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s;
    }
    
    .color-option.active {
      border-color: #3483fa;
    }
    
    /* Product Description Container Styles */
    .product-description-container {
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-top: 20px;
      margin-bottom: 20px;
      width: 100%;
      border-left: 4px solid #ff9800; /* Orange border to distinguish it */
      flex-grow: 1; /* Make it expand to fill available vertical space */
      display: flex;
      flex-direction: column;
    }
    
    .product-description-container h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 20px 0;
      color: #333;
    }
    
    .description-content {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      flex-grow: 1; /* Make it expand to fill available space */
      display: flex;
      flex-direction: column;
    }
    
    .description-content p {
      margin-bottom: 16px;
    }
    
    .description-content p:last-child {
      margin-bottom: 0;
    }
    
    /* Style for wrappers in the info-column */
    .product-info-wrapper,
    .seller-info-wrapper,
    .product-specs-wrapper {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      border: 1px solid #f0f0f0;
    }
    
    .product-info-wrapper {
      border-left: 4px solid #3483fa;
    }
    
    .seller-info-wrapper {
      border-left: 4px solid #39b54a;
      margin-top: 5px;
    }
    
    .product-specs-wrapper {
      border-left: 4px solid #ff6b6b;
      margin-top: 5px;
    }
    
    @media (max-width: 1200px) {
      .product-layout {
        gap: 15px;
      }
      
      .main-column {
        flex: 0 0 55%;
      }
      
      .info-column {
        flex: 0 0 calc(45% - 15px);
      }
    }
    
    @media (max-width: 992px) {
      .product-layout {
        flex-wrap: wrap;
      }
      
      .main-column {
        flex: 0 0 100%;
        margin-bottom: 20px;
      }
      
      .info-column {
        flex: 0 0 100%;
      }
      
      /* On tablets, arrange the info components in a horizontal layout */
      .info-column {
        flex-direction: row;
        flex-wrap: wrap;
      }
      
      .product-info-wrapper {
        flex: 0 0 100%;
      }
      
      .seller-info-wrapper, 
      .product-specs-wrapper {
        flex: 0 0 calc(50% - 10px);
        margin-top: 0;
      }
      
      .seller-info-wrapper {
        margin-right: 10px;
      }
      
      .product-specs-wrapper {
        margin-left: 10px;
      }
    }
    
    @media (max-width: 768px) {
      .product-layout {
        flex-direction: column;
      }
      
      .main-column, .info-column {
        flex: 1 1 100%;
        width: 100%;
      }
      
      /* On mobile, stack all components vertically */
      .info-column {
        flex-direction: column;
      }
      
      .seller-info-wrapper, 
      .product-specs-wrapper {
        flex: 0 0 100%;
        margin: 0 0 20px 0;
      }
      
      /* Reduce padding for mobile */
      .product-info-wrapper,
      .seller-info-wrapper,
      .product-specs-wrapper,
      .product-description-container {
        padding: 15px;
      }
      
      /* Adjust font sizes for mobile */
      .product-description-container h2 {
        font-size: 20px;
        margin-bottom: 15px;
      }
      
      .description-content {
        font-size: 14px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: RelatedProduct[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}
  
  /**
   * Split the product description into paragraphs
   * @returns Array of description paragraphs
   */
  getDescriptionParagraphs(): string[] {
    if (!this.product?.description) return [];
    return this.product.description.split('\n\n').filter(p => p.trim().length > 0);
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.router.navigate(['/search']);
      }
    });
  }
  
  private loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        // Process the product data to ensure it has all required fields
        this.processProductData(product);
        console.log('Product loaded from API:', this.product);
        this.loadRelatedProducts();
      },
      error: (error) => {
        console.error('Error loading product from API:', error);
        this.router.navigate(['/search']);
      }
    });
  }
  
  private loadRelatedProducts(): void {
    this.productService.getRelatedProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }
  
  /**
   * Process the product data from the API to ensure it has all required fields
   * and convert formats as needed
   */
  private processProductData(product: any) {
    console.log('Processing product data:', product);
    if (!product) return;
    
    // Set the product
    this.product = product;
    
    // Ensure we have a breadcrumb array even if the API doesn't provide one
    if (this.product && !this.product.breadcrumb) {
      this.product.breadcrumb = [
        { label: 'Inicio', url: '/' },
        { label: this.product.title || 'Product Details' }
      ];
    }
    
    // If we have stock but not availableQuantity, use stock as availableQuantity
    if (this.product && this.product.stock && !this.product.availableQuantity) {
      this.product.availableQuantity = this.product.stock;
    }
    
    // If we don't have a currency, add a default one
    if (this.product && !this.product.currency) {
      this.product.currency = 'US$';
    }
    
    // If we have reviews but not rating, calculate rating from reviews
    if (this.product && this.product.reviews && this.product.reviews.length > 0 && !this.product.rating) {
      const totalRating = this.product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      this.product.rating = {
        average: totalRating / this.product.reviews.length,
        totalReviews: this.product.reviews.length
      };
    }
    
    // Process images to ensure they are ProductImage objects
    if (this.product && this.product.images && this.product.images.length > 0) {
      console.log("Estas son las urls de las imagenes: " + this.product.images);
      if (typeof this.product.images[0] === 'string') {
        // Cast to string[] to ensure correct typing for the map function
        const stringImages = this.product.images as string[];
        this.product.images = stringImages.map((url: string, index: number) => ({
          id: index.toString(),
          url: url,
          alt: `${this.product?.title || 'Product'} - Image ${index + 1}`
        }));
      }
    }
    
    // Add payment methods if they don't exist or are empty
    if (this.product) {
      console.log('Before adding payment methods:', this.product.paymentMethods);
      if (!this.product.paymentMethods || this.product.paymentMethods.length === 0) {
        this.product.paymentMethods = [
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
    }
  }
}