import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductSearchResult } from './services/product.service';
import { Product, RelatedProduct } from './models/product.model';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
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
    FormsModule,
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
            <div class="search-container">
              <div class="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Buscar productos, marcas y más..." 
                  class="search-input"
                  [(ngModel)]="searchQuery"
                  (input)="onSearchInput()"
                  (focus)="onSearchFocus()"
                  (blur)="onSearchBlur()"
                  (keydown)="onSearchKeydown($event)">
                <button 
                  *ngIf="searchQuery.length > 0" 
                  class="clear-button"
                  (mousedown)="clearSearch($event)">
                  ✕
                </button>
              </div>
              <button class="search-button" (click)="onSearchButtonClick($event)">🔍</button>
              
              <!-- Search suggestions dropdown -->
              <div class="search-suggestions" *ngIf="showSuggestions && searchResults.length > 0">
                <div 
                  *ngFor="let result of searchResults; let i = index" 
                  class="suggestion-item" 
                  [class.selected]="i === selectedIndex"
                  (mousedown)="selectProduct(result)">
                  <div class="suggestion-image">
                    <img [src]="result.image" [alt]="result.title">
                  </div>
                  <div class="suggestion-details">
                    <div class="suggestion-title">{{ result.title }}</div>
                    <div class="suggestion-price">{{ result.currency }} {{ result.price }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Loading indicator -->
              <div class="search-loading" *ngIf="isSearching">
                <div class="search-spinner"></div>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <span class="location">Enviar a Capital Federal</span>
            <button class="cart-button">🛒</button>
          </div>
        </div>
      </header>

      <!-- Product Detail View -->
      <main class="main-content" *ngIf="product && !showSearchResults">
        <div class="container">
          <app-breadcrumb [items]="product.breadcrumb || []"></app-breadcrumb>
          
          <div class="product-layout">
            <div class="product-main">
              <app-product-gallery [images]="product.images || []"></app-product-gallery>
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

      <!-- Search Results View -->
      <main class="main-content" *ngIf="showSearchResults">
        <div class="container">
          <div class="search-results-header">
            <h2>Resultados de búsqueda para "{{ searchQuery }}"</h2>
            <p *ngIf="searchResults.length > 0">{{ searchResults.length }} productos encontrados</p>
          </div>
          
          <div *ngIf="searchResults.length > 0" class="search-results-grid">
            <div *ngFor="let result of searchResults" class="search-result-card" (click)="selectProduct(result)">
              <div class="search-result-image">
                <img [src]="result.image" [alt]="result.title">
              </div>
              <div class="search-result-info">
                <h3 class="search-result-title">{{ result.title }}</h3>
                <p class="search-result-price">{{ result.currency }} {{ result.price }}</p>
                <p class="search-result-description" *ngIf="result.description">{{ result.description }}</p>
                <div class="search-result-shipping">Envío gratis</div>
              </div>
            </div>
          </div>
          
          <div *ngIf="searchResults.length === 0 && !isSearching" class="no-results">
            <p>No se encontraron productos que coincidan con "{{ searchQuery }}"</p>
            <p>Sugerencias:</p>
            <ul>
              <li>Revisa la ortografía de la palabra.</li>
              <li>Utiliza palabras más genéricas o menos palabras.</li>
              <li>Navega por las categorías para encontrar un producto similar.</li>
            </ul>
          </div>
        </div>
      </main>

      <!-- Loading State -->
      <div *ngIf="!product && !showSearchResults && isSearching" class="loading">
        <div class="loading-spinner"></div>
        <p>Cargando...</p>
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
    
    .search-container {
      position: relative;
      flex: 1;
      display: flex;
    }
    
    .input-wrapper {
      position: relative;
      flex: 1;
      display: flex;
    }

    .search-input {
      flex: 1;
      padding: 8px 12px;
      padding-right: 32px; /* Space for clear button */
      border: none;
      border-radius: 2px 0 0 2px;
      font-size: 16px;
      outline: none;
    }
    
    .clear-button {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #999;
      font-size: 14px;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.2s ease;
    }
    
    .clear-button:hover {
      background-color: #f0f0f0;
      color: #333;
    }

    .search-button {
      padding: 8px 12px;
      background: #f5f5f5;
      border: none;
      border-radius: 0 2px 2px 0;
      cursor: pointer;
      font-size: 16px;
    }
    
    /* Search suggestions styles */
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 0 0 4px 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .suggestion-item {
      display: flex;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .suggestion-item:last-child {
      border-bottom: none;
    }
    
    .suggestion-item:hover, .suggestion-item.selected {
      background-color: #f8f8f8;
    }
    
    .suggestion-image {
      width: 50px;
      height: 50px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .suggestion-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }
    
    .suggestion-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .suggestion-title {
      font-size: 14px;
      color: #333;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .suggestion-price {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    /* Loading indicator styles */
    .search-loading {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 0 0 4px 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      padding: 16px;
      display: flex;
      justify-content: center;
    }
    
    .search-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3483FA;
      border-radius: 50%;
      animation: spin 1s linear infinite;
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
    
    /* Search Results Styles */
    .search-results-header {
      margin-bottom: 24px;
    }
    
    .search-results-header h2 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    
    .search-results-header p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
    
    .search-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .search-result-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .search-result-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .search-result-image {
      height: 200px;
      overflow: hidden;
    }
    
    .search-result-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .search-result-info {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .search-result-title {
      font-size: 16px;
      font-weight: 400;
      color: #333;
      margin: 0 0 8px 0;
      line-height: 1.3;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .search-result-price {
      font-size: 24px;
      font-weight: 300;
      color: #333;
      margin: 0 0 8px 0;
    }
    
    .search-result-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 16px 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      flex: 1;
    }
    
    .search-result-shipping {
      color: #00a650;
      font-size: 14px;
      font-weight: 600;
    }
    
    .no-results {
      background: white;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }
    
    .no-results p:first-child {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
    }
    
    .no-results p {
      margin: 0 0 8px 0;
      color: #666;
    }
    
    .no-results ul {
      margin: 0;
      padding-left: 24px;
      color: #666;
    }
    
    .no-results li {
      margin-bottom: 4px;
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
      
      /* Responsive adjustments for search results */
      .search-results-grid {
        grid-template-columns: 1fr;
      }
      
      .search-results-header h2 {
        font-size: 20px;
      }
      
      .search-result-card {
        flex-direction: row;
        height: auto;
      }
      
      .search-result-image {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
      }
      
      .search-result-price {
        font-size: 20px;
      }
      
      .no-results {
        padding: 16px;
      }
    }
    
    @media (max-width: 480px) {
      .search-result-card {
        flex-direction: column;
      }
      
      .search-result-image {
        width: 100%;
        height: 160px;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  relatedProducts: RelatedProduct[] = [];
  productId: string = 'prod-005'; // Default product ID from the API example
  
  // Search properties
  searchQuery: string = '';
  searchResults: ProductSearchResult[] = [];
  showSuggestions: boolean = false;
  isSearching: boolean = false;
  selectedIndex: number = -1;
  showSearchResults: boolean = false; // Flag to show search results page instead of product detail
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProduct(this.productId);
    this.loadRelatedProducts();
    
    // Set up debounced search
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after the last event before emitting
      distinctUntilChanged(), // Only emit if value is different from previous
      switchMap(query => {
        this.isSearching = true;
        return this.productService.searchProducts(query);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
        this.showSuggestions = true;
        this.selectedIndex = -1; // Reset selected index
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.isSearching = false;
        this.searchResults = [];
      }
    });
  }
  
  ngOnDestroy() {
    // Clean up subscriptions
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  
  /**
   * Handle search input changes
   */
  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }
  
  /**
   * Handle search input focus
   */
  onSearchFocus() {
    if (this.searchQuery.trim() !== '') {
      this.showSuggestions = true;
    }
  }
  
  /**
   * Handle search input blur
   */
  onSearchBlur() {
    // Delay hiding suggestions to allow for clicks on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
  
  /**
   * Handle keyboard navigation in search suggestions
   */
  onSearchKeydown(event: KeyboardEvent) {
    // If no suggestions are shown, don't handle keyboard navigation
    if (!this.showSuggestions) {
      return;
    }
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0 && this.selectedIndex < this.searchResults.length) {
          this.selectProduct(this.searchResults[this.selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showSuggestions = false;
        break;
    }
  }
  
  /**
   * Select a product from search results
   */
  selectProduct(product: ProductSearchResult) {
    this.showSuggestions = false;
    this.searchQuery = '';
    this.showSearchResults = false; // Hide search results and show product detail
    this.loadProduct(product.id);
  }
  
  /**
   * Clear the search input
   */
  clearSearch(event: MouseEvent) {
    // Prevent the input from losing focus
    event.preventDefault();
    
    // Clear the search query and results
    this.searchQuery = '';
    this.searchResults = [];
    this.showSuggestions = false;
  }
  
  /**
   * Handle search button click
   */
  onSearchButtonClick(event: MouseEvent) {
    // Prevent default form submission
    event.preventDefault();
    
    // Don't do anything if the search query is empty
    if (!this.searchQuery.trim()) {
      return;
    }
    
    // Hide suggestions dropdown
    this.showSuggestions = false;
    
    // Show loading state
    this.isSearching = true;
    
    // Perform search
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
        // Show search results page instead of product detail
        this.showSearchResults = true;
        // Reset product to null to avoid showing both
        this.product = null;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.isSearching = false;
        this.searchResults = [];
      }
    });
  }

  loadProduct(id: string) {
    this.product = null; // Reset product to show loading state
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        // Process the product data to ensure it has all required fields
        this.processProductData(product);
        console.log('Product loaded:', this.product);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        // Fallback to mock data in case of error
        this.productService.getMockProduct(id).subscribe(mockProduct => {
          this.product = mockProduct;
          console.log('Loaded mock product as fallback');
        });
      }
    });
  }
  
  /**
   * Process the product data from the API to ensure it has all required fields
   * and convert formats as needed
   */
  private processProductData(product: any) {
    if (!product) return;
    
    // Ensure we have a breadcrumb array even if the API doesn't provide one
    if (!product.breadcrumb) {
      product.breadcrumb = [
        { label: 'Inicio', url: '/' },
        { label: product.title }
      ];
    }
    
    // If we have stock but not availableQuantity, use stock as availableQuantity
    if (product.stock && !product.availableQuantity) {
      product.availableQuantity = product.stock;
    }
    
    // If we don't have a currency, add a default one
    if (!product.currency) {
      product.currency = 'US$';
    }
    
    // If we have reviews but not rating, calculate rating from reviews
    if (product.reviews && product.reviews.length > 0 && !product.rating) {
      const totalRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      product.rating = {
        average: totalRating / product.reviews.length,
        totalReviews: product.reviews.length
      };
    }
    
    // Set the processed product
    this.product = product;
  }

  loadRelatedProducts() {
    this.productService.getRelatedProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }
}