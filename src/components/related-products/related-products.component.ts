import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedProduct } from '../../models/product.model';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="related-products" *ngIf="products.length > 0">
      <h2>Productos relacionados</h2>
      <div class="products-container">
        <div class="products-scroll">
          <div *ngFor="let product of products" class="product-card">
            <img [src]="product.image" [alt]="product.title" class="product-image">
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <div class="product-price">
                {{ product.currency }} {{ product.price }}
                <span class="price-cents">75</span>
                <span class="discount">13% OFF</span>
              </div>
              <div class="product-meta">
                <span class="installments">en 12 cuotas de $ 1.836,86 sin interés</span>
                <span class="free-shipping" *ngIf="product.freeShipping">Envío gratis</span>
              </div>
            </div>
          </div>
        </div>
        <button class="scroll-btn scroll-btn-right">›</button>
      </div>
    </div>
  `,
  styles: [`
    .related-products {
      margin-top: 48px;
      padding: 24px 0;
    }

    .related-products h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px 0;
      color: #333;
    }

    .products-container {
      position: relative;
    }

    .products-scroll {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding-bottom: 8px;
    }

    .products-scroll::-webkit-scrollbar {
      height: 6px;
    }

    .products-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .products-scroll::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 3px;
    }

    .product-card {
      flex-shrink: 0;
      width: 240px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .product-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .product-info {
      padding: 16px;
    }

    .product-title {
      font-size: 14px;
      font-weight: 400;
      color: #333;
      margin: 0 0 8px 0;
      line-height: 1.3;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-price {
      font-size: 24px;
      font-weight: 300;
      color: #333;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .price-cents {
      font-size: 14px;
      vertical-align: top;
    }

    .discount {
      background: #00a650;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .product-meta {
      font-size: 12px;
      color: #00a650;
    }

    .installments {
      display: block;
      margin-bottom: 4px;
    }

    .free-shipping {
      color: #00a650;
      font-weight: 600;
    }

    .scroll-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      color: #666;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    }

    .scroll-btn:hover {
      background: #f5f5f5;
      color: #333;
    }

    .scroll-btn-right {
      right: -20px;
    }

    @media (max-width: 768px) {
      .related-products h2 {
        font-size: 20px;
      }

      .product-card {
        width: 200px;
      }

      .scroll-btn {
        display: none;
      }
    }
  `]
})
export class RelatedProductsComponent {
  @Input() products: RelatedProduct[] = [];
}