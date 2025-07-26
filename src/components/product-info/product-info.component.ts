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

  getStars(rating: number | undefined): number[] {
    const stars = [];
    const validRating = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(validRating)) {
        stars.push(1);
      } else if (i - 0.5 <= validRating) {
        stars.push(0.5);
      } else {
        stars.push(0);
      }
    }
    
    return stars;
  }
  
  getRating(): number {
    if (!this.product?.rating) return 0;
    
    if (typeof this.product.rating === 'number') {
      return this.product.rating;
    } else if (this.product.rating.average) {
      return this.product.rating.average;
    }
    
    return 0;
  }
  
  getTotalReviews(): number {
    if (!this.product?.rating) return 0;
    
    if (typeof this.product.rating === 'number') {
      return this.product.reviews?.length || 0;
    } else if (this.product.rating.totalReviews) {
      return this.product.rating.totalReviews;
    }
    
    return 0;
  }

  getDiscountPercentage(): number {
    if (!this.product?.originalPrice || !this.product.price) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}