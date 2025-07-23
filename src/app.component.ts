import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';
import { Product, RelatedProduct } from './models/product.model';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { SellerInfoComponent } from './components/seller-info/seller-info.component';
import { ProductSpecificationsComponent } from './components/product-specifications/product-specifications.component';
import { RelatedProductsComponent } from './components/related-products/related-products.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ProductGalleryComponent,
    ProductInfoComponent,
    SellerInfoComponent,
    ProductSpecificationsComponent,
    RelatedProductsComponent
  ],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-text">MercadoLibre</span>
          </div>
          <div class="search-bar">
            <input type="text" placeholder="Buscar productos, marcas y más..." class="search-input">
            <button class="search-button">🔍</button>
          </div>
          <div class="header-actions">
            <span class="location">Enviar a Capital Federal</span>
            <button class="cart-button">🛒</button>
          </div>
        </div>
      </header>

      <main class="main-content" *ngIf="product">
        <div class="container">
          <app-breadcrumb [items]="product.breadcrumb"></app-breadcrumb>
          
          <div class="product-layout">
            <div class="product-main">
              <app-product-gallery [images]="product.images"></app-product-gallery>
              <app-product-info [product]="product"></app-product-info>
            </div>
            <div class="product-sidebar">
              <app-seller-info [product]="product"></app-seller-info>
            </div>
          </div>

          <app-product-specifications [product]="product"></app-product-specifications>
          <app-related-products [products]="relatedProducts"></app-related-products>
        </div>
      </main>

      <div *ngIf="!product" class="loading">
        <div class="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      background-color: #ebebeb;
    }

    .header {
      background: #fff159;
      border-bottom: 1px solid #ddd;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .search-bar {
      flex: 1;
      display: flex;
      max-width: 600px;
    }

    .search-input {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 2px 0 0 2px;
      font-size: 16px;
      outline: none;
    }

    .search-button {
      padding: 8px 12px;
      background: #f5f5f5;
      border: none;
      border-radius: 0 2px 2px 0;
      cursor: pointer;
      font-size: 16px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .location {
      font-size: 14px;
      color: #333;
    }

    .cart-button {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }

    .main-content {
      padding: 16px 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .product-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
      margin-bottom: 24px;
    }

    .product-main {
      background: white;
      border-radius: 8px;
      padding: 24px;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 32px;
    }

    .product-sidebar {
      align-self: flex-start;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #666;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3483FA;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .product-layout {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .product-main {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 12px;
      }

      .search-bar {
        width: 100%;
        max-width: none;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .container {
        padding: 0 8px;
      }

      .product-main {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: RelatedProduct[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Simulate loading a product by ID
    this.productService.getProduct('MLA123456789').subscribe(product => {
      this.product = product;
    });

    this.productService.getRelatedProducts().subscribe(products => {
      this.relatedProducts = products;
    });
  }
}