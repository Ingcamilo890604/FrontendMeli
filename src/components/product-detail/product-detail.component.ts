import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, RelatedProduct } from '../../models/product.model';
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
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productFacade: ProductFacade
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
    if (this.product && this.product.productType) {
      const productType = this.product.productType;
      
      this.productFacade.getRelatedProducts(productType).subscribe({
        next: (products) => {
          if (products && products.length > 0) {
            this.relatedProducts = products;
          } else {
            this.relatedProducts = [];
          }
        },
        error: (error) => {
          this.relatedProducts = [];
        }
      });
    } else {
      this.relatedProducts = [];
    }
  }
}