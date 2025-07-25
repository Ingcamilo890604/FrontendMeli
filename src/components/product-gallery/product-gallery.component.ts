import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImage } from '../../models/product.model';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css']
})
export class ProductGalleryComponent implements OnChanges {
  @Input() images: ProductImage[] | string[] = [];
  processedImages: ProductImage[] = [];
  selectedIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.processImages();
    }
  }

  processImages(): void {
    if (!this.images || this.images.length === 0) {
      this.processedImages = [];
      return;
    }

    // Check if images are strings (from API) or ProductImage objects
    if (typeof this.images[0] === 'string') {
      // Convert string[] to ProductImage[]
      this.processedImages = (this.images as string[]).map((url, index) => ({
        id: index.toString(),
        url: url,
        alt: `Product image ${index + 1}`
      }));
    } else {
      // Already ProductImage[]
      this.processedImages = this.images as ProductImage[];
    }
  }

  get selectedImage(): ProductImage | undefined {
    return this.processedImages[this.selectedIndex];
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }
}