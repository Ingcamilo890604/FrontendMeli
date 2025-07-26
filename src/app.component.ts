import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <a [routerLink]="['/']" class="logo-text">MercadoLibre</a>
          </div>
          <div class="header-actions">
            <span class="location">Enviar a Capital Federal</span>
            <button class="cart-button">🛒</button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
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
      justify-content: space-between;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      text-decoration: none;
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

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 12px;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class AppComponent {
  // The component is now just a shell that contains the router outlet
  // All functionality has been moved to the routed components
}