import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, ProductSearchResult } from '../../services/product.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="search-results-container">
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
            @if (searchQuery.length > 0) {
              <button 
                class="clear-button"
                (mousedown)="clearSearch($event)">
                ✕
              </button>
            }
          </div>
          <button class="search-button" (click)="onSearchButtonClick($event)">🔍</button>
          
          @if (showSuggestions && searchResults.length > 0) {
            <div class="search-suggestions">
              @for (result of searchResults; track $index; let i = $index) {
                <div 
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
              }
            </div>
          }
          
          @if (isSearching) {
            <div class="search-loading">
              <div class="search-spinner"></div>
            </div>
          }
        </div>
      </div>

      <div class="search-results">
        <div class="search-results-header">
          <h2>Resultados de búsqueda para "{{ searchQuery }}"</h2>
          @if (searchResults.length > 0) {
            <p>{{ searchResults.length }} productos encontrados</p>
          } @else {
            <p>No se encontraron productos</p>
          }
        </div>
        
        <div class="search-results-grid">
          @for (result of searchResults; track $index) {
            <div class="search-result-card" (click)="selectProduct(result)">
              <div class="search-result-image">
                <img [src]="result.image" [alt]="result.title">
              </div>
              <div class="search-result-details">
                <h3 class="search-result-title">{{ result.title }}</h3>
                <p class="search-result-price">{{ result.currency }} {{ result.price }}</p>
                @if (result.description) {
                  <p class="search-result-description">{{ result.description }}</p>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-results-container {
      padding: 20px;
    }
    
    .search-bar {
      margin-bottom: 20px;
    }
    
    .search-container {
      display: flex;
      position: relative;
    }
    
    .input-wrapper {
      flex: 1;
      position: relative;
    }
    
    .search-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
    }
    
    .clear-button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
    }
    
    .search-button {
      padding: 10px 15px;
      background-color: #3483fa;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      z-index: 10;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .suggestion-item {
      display: flex;
      padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
    }
    
    .suggestion-item:hover, .suggestion-item.selected {
      background-color: #f5f5f5;
    }
    
    .suggestion-image {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    
    .suggestion-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .search-loading {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      z-index: 10;
      padding: 20px;
      text-align: center;
    }
    
    .search-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3483fa;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .search-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .search-result-card {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .search-result-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
    
    .search-result-details {
      padding: 15px;
    }
    
    .search-result-title {
      margin: 0 0 10px;
      font-size: 16px;
    }
    
    .search-result-price {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px;
    }
    
    .search-result-description {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  `]
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: ProductSearchResult[] = [];
  showSuggestions: boolean = false;
  isSearching: boolean = false;
  selectedIndex: number = -1;
  
  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  
  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
  ) {}
  
  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.isSearching = true;
        return this.productService.searchProducts(query);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (error) => {
        this.isSearching = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }
  
  onSearchFocus(): void {
    if (this.searchResults.length > 0) {
      this.showSuggestions = true;
    }
  }
  
  onSearchBlur(): void {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
  
  onSearchKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.searchResults.length === 0) {
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
        } else {
          this.onSearchButtonClick(event);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showSuggestions = false;
        break;
    }
  }
  
  selectProduct(product: ProductSearchResult): void {
    this.router.navigate(['/product', product.id]);
  }
  
  clearSearch(event: MouseEvent): void {
    event.preventDefault();
    this.searchQuery = '';
    this.searchResults = [];
    this.showSuggestions = false;
  }
  
  onSearchButtonClick(event: Event): void {
    event.preventDefault();
    
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return;
    }
    
    this.isSearching = true;
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSuggestions = false;
        this.isSearching = false;
      },
      error: (error) => {
        this.isSearching = false;
      }
    });
  }
}