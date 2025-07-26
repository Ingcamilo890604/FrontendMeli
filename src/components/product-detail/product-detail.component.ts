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
          <div class="product-main">
            <app-product-gallery [images]="product?.images || []"></app-product-gallery>
            <app-product-info [product]="product"></app-product-info>
          </div>
          <div class="product-sidebar">
            <app-seller-info [product]="product"></app-seller-info>
          </div>
        </div>

        <app-product-specifications [product]="product"></app-product-specifications>
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
    
    .product-main {
      flex: 1 1 700px;
    }
    
    .product-sidebar {
      flex: 0 1 300px;
    }
    
    @media (max-width: 768px) {
      .product-layout {
        flex-direction: column;
      }
      
      .product-main, .product-sidebar {
        flex: 1 1 100%;
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