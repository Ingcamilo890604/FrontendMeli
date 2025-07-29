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

    const isStringArray = typeof this.images[0] === 'string';

    if (isStringArray) {
      this.processedImages = (this.images as string[]).map((url, index) => ({
        id: index.toString(),
        url: url.startsWith('/') ? url : `/${url}`,
        alt: `Product image ${index + 1}`
      }));
    } else {
      this.processedImages = (this.images as ProductImage[]).map((image, index) => ({
        ...image,
        url: image.url.startsWith('/') ? image.url : `/${image.url}`
      }));
    }
  }

  get selectedImage(): ProductImage | undefined {
    return this.processedImages[this.selectedIndex];
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  onImageLoad(event: Event, index: number): void {
  }

  onImageError(event: Event, index: number): void {
  }

  onMainImageLoad(event: Event): void {
  }

  onMainImageError(event: Event): void {
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' && this.selectedIndex < this.processedImages.length - 1) {
      this.selectImage(this.selectedIndex + 1);
    } else if (event.key === 'ArrowLeft' && this.selectedIndex > 0) {
      this.selectImage(this.selectedIndex - 1);
    }
  }
}