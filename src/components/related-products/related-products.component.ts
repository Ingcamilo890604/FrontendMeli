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
}