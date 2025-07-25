import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent {
  @Input() product: Product | null = null;

  getStars(rating: number | undefined): boolean[] {
    const stars = [];
    const validRating = rating || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= validRating);
    }
    return stars;
  }

  getDiscountPercentage(): number {
    if (!this.product?.originalPrice || !this.product.price) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}