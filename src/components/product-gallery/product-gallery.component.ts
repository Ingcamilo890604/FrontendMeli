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
      console.log("No vienen imágenes");
      this.processedImages = [];
      return;
    }

    console.log("Cantidad de imágenes:", this.images.length);
    console.log("Tipo del primer elemento:", typeof this.images[0]);
    console.log("Primer elemento:", this.images[0]);

    // Detectar si vienen como strings
    const isStringArray = typeof this.images[0] === 'string';

    if (isStringArray) {
      this.processedImages = (this.images as string[]).map((url, index) => ({
        id: index.toString(),
        url: url.startsWith('/') ? url : `/${url}`, // Asegurar que tenga leading slash
        alt: `Product image ${index + 1}`
      }));
      console.log("Imágenes procesadas (string[]):", this.processedImages);
    } else {
      // Ya vienen como objetos (ProductImage[])
      this.processedImages = (this.images as ProductImage[]).map((image, index) => ({
        ...image,
        url: image.url.startsWith('/') ? image.url : `/${image.url}` // Asegurar que tenga leading slash
      }));
      console.log("Imágenes procesadas (ProductImage[]):", this.processedImages);
    }
  }

  get selectedImage(): ProductImage | undefined {
    return this.processedImages[this.selectedIndex];
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  onImageLoad(event: Event, index: number): void {
    console.log(`Thumbnail ${index} loaded successfully:`, (event.target as HTMLImageElement).src);
  }

  onImageError(event: Event, index: number): void {
    console.error(`Error loading thumbnail ${index}:`, (event.target as HTMLImageElement).src);
  }

  onMainImageLoad(event: Event): void {
    console.log('Main image loaded successfully:', (event.target as HTMLImageElement).src);
  }

  onMainImageError(event: Event): void {
    console.error('Error loading main image:', (event.target as HTMLImageElement).src);
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Key down event on main image:', event.key);
    
    // Example of handling arrow keys for image navigation
    if (event.key === 'ArrowRight' && this.selectedIndex < this.processedImages.length - 1) {
      this.selectImage(this.selectedIndex + 1);
    } else if (event.key === 'ArrowLeft' && this.selectedIndex > 0) {
      this.selectImage(this.selectedIndex - 1);
    }
  }
}