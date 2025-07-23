import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-seller-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seller-info" *ngIf="product">
      <!-- Stock & Shipping -->
      <div class="stock-shipping">
        <div class="stock-available">
          <span class="stock-text">Stock disponible</span>
        </div>
        <div class="quantity">
          <span>Cantidad: </span>
          <strong>1 unidad</strong>
          <small>({{ product.availableQuantity }}+ disponibles)</small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-primary">Comprar ahora</button>
        <button class="btn-secondary">Agregar al carrito</button>
      </div>

      <!-- Shipping Info -->
      <div class="shipping-info" *ngIf="product.shipping">
        <div class="shipping-item">
          <span class="icon">🚚</span>
          <div>
            <div class="shipping-text">
              <span *ngIf="product.shipping.freeShipping" class="free-shipping">Envío gratis</span>
              a todo el país
            </div>
            <div class="shipping-details">
              Conoce los tiempos y las formas de envío.
              <br>Calcular cuándo llega
            </div>
          </div>
        </div>

        <div class="shipping-item">
          <span class="icon">📍</span>
          <div>
            <div class="shipping-text">Devolución gratis.</div>
            <div class="shipping-details">
              Tienes 30 días desde que lo recibes.
            </div>
          </div>
        </div>

        <div class="shipping-item">
          <span class="icon">🛡️</span>
          <div>
            <div class="shipping-text">Compra Protegida.</div>
            <div class="shipping-details">
              Recibes el producto que esperabas o te devolvemos tu dinero.
            </div>
          </div>
        </div>

        <div class="shipping-item">
          <span class="icon">🏆</span>
          <div class="shipping-text">12 meses de garantía de fábrica.</div>
        </div>
      </div>

      <!-- Official Store -->
      <div class="official-store" *ngIf="product.seller.isOfficialStore">
        <div class="store-badge">
          <span class="badge">Tienda Oficial</span>
        </div>
        <div class="store-info">
          <div class="store-name">{{ product.seller.name }}</div>
          <div class="store-details">
            <span class="store-icon">👑</span>
            <span>MercadoLíder Platinum</span>
          </div>
          <div class="store-stats">+5M Productos</div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="payment-methods">
        <h4>Medios de pago</h4>
        <div class="payment-item">
          <span class="payment-icon">💳</span>
          <div>
            <div class="payment-title">¡Paga en hasta 12 cuotas sin interés!</div>
            <div class="payment-details">Tarjetas de débito</div>
          </div>
        </div>
        
        <div class="payment-cards">
          <div class="card-icons">
            <span class="card-icon visa">VISA</span>
            <span class="card-icon master">MC</span>
            <span class="card-icon oca">OCA</span>
          </div>
        </div>

        <div class="payment-item">
          <span class="payment-icon">💵</span>
          <div class="payment-title">Efectivo</div>
        </div>

        <a href="#" class="see-all-payments">Conoce otros medios de pago</a>
      </div>
    </div>
  `,
  styles: [`
    .seller-info {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 350px;
    }

    .stock-shipping {
      margin-bottom: 24px;
    }

    .stock-available {
      color: #00a650;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .quantity {
      font-size: 14px;
      color: #666;
    }

    .quantity small {
      color: #999;
      margin-left: 4px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn-primary {
      background: #3483FA;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-primary:hover {
      background: #2968c8;
    }

    .btn-secondary {
      background: rgba(52, 131, 250, 0.1);
      color: #3483FA;
      border: 1px solid #3483FA;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: rgba(52, 131, 250, 0.2);
    }

    .shipping-info {
      margin-bottom: 24px;
    }

    .shipping-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .shipping-text {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .free-shipping {
      color: #00a650;
    }

    .shipping-details {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }

    .official-store {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .store-badge {
      margin-bottom: 8px;
    }

    .badge {
      background: #3483FA;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .store-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .store-details {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }

    .store-icon {
      font-size: 12px;
    }

    .store-stats {
      font-size: 12px;
      color: #999;
    }

    .payment-methods h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }

    .payment-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .payment-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .payment-title {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .payment-details {
      font-size: 12px;
      color: #666;
    }

    .payment-cards {
      margin: 12px 0 16px 36px;
    }

    .card-icons {
      display: flex;
      gap: 8px;
    }

    .card-icon {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }

    .card-icon.visa {
      background: #1a1f71;
    }

    .card-icon.master {
      background: #eb001b;
    }

    .card-icon.oca {
      background: #0066cc;
    }

    .see-all-payments {
      color: #3483FA;
      text-decoration: none;
      font-size: 14px;
      margin-left: 36px;
    }

    .see-all-payments:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .seller-info {
        max-width: none;
        margin-top: 24px;
      }
    }
  `]
})
export class SellerInfoComponent {
  @Input() product: Product | null = null;
}