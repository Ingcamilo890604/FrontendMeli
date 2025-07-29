import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, RelatedProduct, Page } from '../../models/product.model';
import { ProductFacade } from '../../facades/product.facade';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { SellerInfoComponent } from '../seller-info/seller-info.component';
import { ProductSpecificationsComponent } from '../product-specifications/product-specifications.component';
import { RelatedProductsComponent } from '../related-products/related-products.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';
import { ProductDescriptionComponent } from '../product-description/product-description.component';

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
    ReviewsComponent,
    ColorSelectorComponent,
    ProductDescriptionComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: RelatedProduct[] = [];
  selectedColor: string = 'azul oscuro';
  
  // Pagination state for related products
  relatedProductsPage: Page<RelatedProduct> | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productFacade: ProductFacade
  ) {}
  
  onColorSelected(color: string): void {
    this.selectedColor = color;
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
    this.productFacade.getProduct(id).subscribe({
      next: (product) => {
        this.product = this.productFacade.processProductData(product);
        this.loadRelatedProducts();
      },
      error: (error) => {
        this.router.navigate(['/search']);
      }
    });
  }
  
  private loadRelatedProducts(): void {
    const productType = this.product?.productType;
    
    if (productType) {
      this.productFacade.getRelatedProductsPage(productType, this.currentPage, this.pageSize).subscribe({
        next: (page) => {
          this.relatedProductsPage = page;
          this.relatedProducts = page.content;
          this.totalPages = page.totalPages;
          this.hasNextPage = page.hasNext;
          this.hasPreviousPage = page.hasPrevious;
        },
        error: (error) => {
          this.relatedProducts = [];
          this.relatedProductsPage = null;
          this.totalPages = 0;
          this.hasNextPage = false;
          this.hasPreviousPage = false;
        }
      });
    } else {
      this.relatedProducts = [];
      this.relatedProductsPage = null;
      this.totalPages = 0;
      this.hasNextPage = false;
      this.hasPreviousPage = false;
    }
  }
  
  /**
   * Handle page change for related products
   * @param page The new page number (0-based)
   */
  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRelatedProducts();
    }
  }
  
  /**
   * Go to the next page of related products
   */
  nextPage(): void {
    if (this.hasNextPage) {
      this.onPageChange(this.currentPage + 1);
    }
  }
  
  /**
   * Go to the previous page of related products
   */
  previousPage(): void {
    if (this.hasPreviousPage) {
      this.onPageChange(this.currentPage - 1);
    }
  }
}