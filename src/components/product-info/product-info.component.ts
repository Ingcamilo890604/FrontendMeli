import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-info" *ngIf="product">
      <div class="condition-stock">
        <span class="condition">{{ product.condition }}</span>
        <span class="separator">|</span>
        <span class="stock">{{ product.soldQuantity }}+ vendidos</span>
      </div>

      <h1 class="product-title">{{ product.title }}</h1>

      <div class="rating" *ngIf="product.rating">
        <div class="stars">
          <span *ngFor="let star of getStars(product.rating.average)" 
                class="star" 
                [class.filled]="star">★</span>
        </div>
        <span class="rating-text">{{ product.rating.average }} ({{ product.rating.totalReviews }})</span>
      </div>

      <div class="price-section">
        <div class="original-price" *ngIf="product.originalPrice">
          {{ product.currency }} {{ product.originalPrice }}
        </div>
        <div class="current-price">
          {{ product.currency }} {{ product.price }}
          <span class="discount" *ngIf="product.originalPrice">
            {{ getDiscountPercentage() }}% OFF
          </span>
        </div>
        <div class="installments">
          en 12 cuotas de $ 1,814.06 sin interés
        </div>
        <div class="payment-promotion">
          Ver los 6 medios de pago
        </div>
      </div>

      <div class="key-features">
        <h3>Lo que tienes que saber de este producto</h3>
        <ul>
          <li *ngFor="let spec of product.specifications">
            <strong>{{ spec.name }}:</strong> {{ spec.value }}
          </li>
        </ul>
      </div>

      <div class="color-selection">
        <h4>Color: azul oscuro</h4>
        <div class="color-options">
          <div class="color-option active" style="background-color: #1a1a2e;"></div>
        </div>
      </div>

      <div class="purchase-options">
        <h4>Opciones de compra:</h4>
        <p>2 opciones desde US$ 418</p>
      </div>
    </div>
  `,
  styles: [`
    .product-info {
      max-width: 600px;
    }

    .condition-stock {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .separator {
      margin: 0 8px;
    }

    .product-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      color: #ddd;
      font-size: 16px;
    }

    .star.filled {
      color: #3483FA;
    }

    .rating-text {
      font-size: 14px;
      color: #666;
    }

    .price-section {
      margin-bottom: 32px;
    }

    .original-price {
      font-size: 16px;
      color: #999;
      text-decoration: line-through;
      margin-bottom: 4px;
    }

    .current-price {
      font-size: 36px;
      font-weight: 300;
      color: #333;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .discount {
      background-color: #00a650;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
    }

    .installments {
      font-size: 16px;
      color: #00a650;
      margin-bottom: 8px;
    }

    .payment-promotion {
      font-size: 14px;
      color: #3483FA;
      cursor: pointer;
    }

    .key-features {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .key-features h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .key-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .key-features li {
      padding: 6px 0;
      font-size: 14px;
      color: #333;
    }

    .color-selection {
      margin-bottom: 24px;
    }

    .color-selection h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .color-options {
      display: flex;
      gap: 8px;
    }

    .color-option {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .color-option.active {
      border-color: #3483FA;
      box-shadow: 0 0 0 2px white, 0 0 0 4px #3483FA;
    }

    .purchase-options h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .purchase-options p {
      font-size: 14px;
      color: #3483FA;
      margin: 0;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .product-title {
        font-size: 20px;
      }

      .current-price {
        font-size: 28px;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class ProductInfoComponent {
  @Input() product: Product | null = null;

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getDiscountPercentage(): number {
    if (!this.product?.originalPrice || !this.product.price) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}