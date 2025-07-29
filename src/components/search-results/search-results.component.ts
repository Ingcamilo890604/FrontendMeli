import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, ProductSearchResult } from '../../services/product.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UI, APP } from '../../constants';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: ProductSearchResult[] = [];
  showSuggestions: boolean = false;
  isSearching: boolean = false;
  selectedIndex: number = -1;
  
  // Pagination state
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  
  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  
  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
  ) {}
  
  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(UI.SEARCH.DEBOUNCE_TIME),
      distinctUntilChanged(),
      switchMap(query => {
        this.isSearching = true;
        // For suggestions, we still use the non-paginated version to keep it simple
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
    }, UI.SEARCH.CLEAR_DELAY);
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
    this.router.navigate([APP.ROUTES.PRODUCT, product.id]);
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
    
    // Reset pagination state when performing a new search
    this.currentPage = 0;
    
    this.loadSearchResults();
  }
  
  /**
   * Load search results with pagination
   */
  private loadSearchResults(): void {
    this.isSearching = true;
    this.productService.searchProductsPage(this.searchQuery, this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.searchResults = page.content;
        this.totalPages = page.totalPages;
        this.hasNextPage = page.hasNext;
        this.hasPreviousPage = page.hasPrevious;
        this.showSuggestions = false;
        this.isSearching = false;
      },
      error: () => {
        this.searchResults = [];
        this.totalPages = 0;
        this.hasNextPage = false;
        this.hasPreviousPage = false;
        this.isSearching = false;
      }
    });
  }
  
  /**
   * Handle page change
   * @param page The page number to navigate to
   */
  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadSearchResults();
    }
  }
  
  /**
   * Go to the next page of search results
   */
  nextPage(): void {
    if (this.hasNextPage) {
      this.onPageChange(this.currentPage + 1);
    }
  }
  
  /**
   * Go to the previous page of search results
   */
  previousPage(): void {
    if (this.hasPreviousPage) {
      this.onPageChange(this.currentPage - 1);
    }
  }
}