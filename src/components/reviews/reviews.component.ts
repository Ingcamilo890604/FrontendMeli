import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../models/product.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnChanges {
  @Input() reviews: Review[] = [];
  
  averageRating: number = 0;
  displayedReviews: Review[] = [];
  ratingDistribution: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  maxDisplayedReviews: number = 5;
  showMoreVisible: boolean = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviews']) {
      this.processReviews();
    }
  }
  
  processReviews(): void {
    if (!this.reviews || this.reviews.length === 0) {
      this.averageRating = 0;
      this.displayedReviews = [];
      this.resetRatingDistribution();
      this.showMoreVisible = false;
      return;
    }
    
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    
    this.resetRatingDistribution();
    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        this.ratingDistribution[review.rating]++;
      }
    });
    
    this.displayedReviews = this.reviews.slice(0, this.maxDisplayedReviews);
    
    this.showMoreVisible = this.reviews.length > this.maxDisplayedReviews;
  }
  
  resetRatingDistribution(): void {
    for (let i = 1; i <= 5; i++) {
      this.ratingDistribution[i] = 0;
    }
  }
  
  getRatingPercentage(rating: number): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }
    
    return (this.ratingDistribution[rating] / this.reviews.length) * 100;
  }
  
  getStars(rating: number): number[] {
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
  
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }
  
  onShowMoreClick(): void {
    this.displayedReviews = this.reviews;
    this.showMoreVisible = false;
  }
}