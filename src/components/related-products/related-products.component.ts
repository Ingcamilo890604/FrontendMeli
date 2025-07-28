import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedProduct } from '../../models/product.model';

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
  
  /**
   * Get the title to display based on whether we have a product type or not
   */
  getTitle(): string {
    if (this.productType) {
      return `Más productos de tipo "${this.productType}"`;
    }
    return 'Productos relacionados';
  }
}