import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedProduct, Page } from '../../models/product.model';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.css']
})
export class RelatedProductsComponent {
  @Input() products: RelatedProduct[] = [];
  @Input() productType: string | undefined | null = null;
  
  // Pagination inputs
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() hasNextPage: boolean = false;
  @Input() hasPreviousPage: boolean = false;
  
  // Pagination events
  @Output() pageChange = new EventEmitter<number>();
  @Output() nextPageClick = new EventEmitter<void>();
  @Output() previousPageClick = new EventEmitter<void>();
  
  /**
   * Get the title to display based on whether we have a product type or not
   */
  getTitle(): string {
    if (this.productType) {
      return `Más productos de tipo "${this.productType}"`;
    }
    return 'Productos relacionados';
  }
  
  /**
   * Handle page change
   * @param page The page number to navigate to
   */
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
  
  /**
   * Handle next page click
   */
  onNextPage(): void {
    if (this.hasNextPage) {
      this.nextPageClick.emit();
    }
  }
  
  /**
   * Handle previous page click
   */
  onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.previousPageClick.emit();
    }
  }
}