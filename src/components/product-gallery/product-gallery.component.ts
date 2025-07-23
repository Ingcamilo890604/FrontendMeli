import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImage } from '../../models/product.model';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-gallery">
      <div class="thumbnails">
        <img 
          *ngFor="let image of images; let i = index"
          [src]="image.url"
          [alt]="image.alt"
          [class.active]="i === selectedIndex"
          (click)="selectImage(i)"
          class="thumbnail"
        />
      </div>
      <div class="main-image">
        <img 
          [src]="selectedImage?.url"
          [alt]="selectedImage?.alt"
          class="main-img"
        />
      </div>
    </div>
  `,
  styles: [`
    .product-gallery {
      display: flex;
      gap: 16px;
    }

    .thumbnails {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .thumbnail {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .thumbnail:hover {
      border-color: #3483FA;
    }

    .thumbnail.active {
      border-color: #3483FA;
    }

    .main-image {
      flex: 1;
      max-width: 500px;
    }

    .main-img {
      width: 100%;
      height: auto;
      max-height: 500px;
      object-fit: contain;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .product-gallery {
        flex-direction: column-reverse;
      }

      .thumbnails {
        flex-direction: row;
        overflow-x: auto;
        padding: 8px 0;
      }

      .thumbnail {
        flex-shrink: 0;
      }
    }
  `]
})
export class ProductGalleryComponent {
  @Input() images: ProductImage[] = [];
  selectedIndex = 0;

  get selectedImage(): ProductImage | undefined {
    return this.images[this.selectedIndex];
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }
}