import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductFacade } from '../../facades/product.facade';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent {
  @Input() product: Product | null = null;
  
  constructor(private readonly productFacade: ProductFacade) {}
  
  getDescriptionParagraphs(): string[] {
    if (!this.product) return [];
    return this.productFacade.getDescriptionParagraphs(this.product.description);
  }
}