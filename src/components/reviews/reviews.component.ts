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
  
  // Properties for the component
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
      console.log('Reviews in ReviewsComponent:', this.reviews);
      this.processReviews();
    }
  }
  
  /**
   * Process reviews data to calculate average rating, rating distribution, and set displayed reviews
   */
  processReviews(): void {
    if (!this.reviews || this.reviews.length === 0) {
      this.averageRating = 0;
      this.displayedReviews = [];
      this.resetRatingDistribution();
      this.showMoreVisible = false;
      return;
    }
    
    // Calculate average rating
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    
    // Calculate rating distribution
    this.resetRatingDistribution();
    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        this.ratingDistribution[review.rating]++;
      }
    });
    
    // Set displayed reviews
    this.displayedReviews = this.reviews.slice(0, this.maxDisplayedReviews);
    
    // Determine if "Show More" button should be visible
    this.showMoreVisible = this.reviews.length > this.maxDisplayedReviews;
  }
  
  /**
   * Reset rating distribution to zero counts
   */
  resetRatingDistribution(): void {
    for (let i = 1; i <= 5; i++) {
      this.ratingDistribution[i] = 0;
    }
  }
  
  /**
   * Get the percentage of reviews with a specific rating
   * @param rating The rating (1-5)
   * @returns The percentage of reviews with the specified rating
   */
  getRatingPercentage(rating: number): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }
    
    return (this.ratingDistribution[rating] / this.reviews.length) * 100;
  }
  
  /**
   * Get an array of numbers representing stars for a rating
   * @param rating The rating value
   * @returns Array of numbers (1 = filled star, 0.5 = half-filled star, 0 = empty star)
   */
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
  
  /**
   * Format a date string to a more readable format
   * @param dateString The date string in ISO format
   * @returns Formatted date string
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
  
  /**
   * Show more reviews when the "Show More" button is clicked
   */
  onShowMoreClick(): void {
    // Show all reviews
    this.displayedReviews = this.reviews;
    this.showMoreVisible = false;
  }
}