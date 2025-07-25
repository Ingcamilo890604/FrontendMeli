import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-specifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-specifications.component.html',
  styleUrls: ['./product-specifications.component.css']
})
export class ProductSpecificationsComponent {
  @Input() product: Product | null = null;

  getDescriptionParagraphs(): string[] {
    if (!this.product?.description) return [];
    return this.product.description.split('\n\n').filter(p => p.trim().length > 0);
  }
}