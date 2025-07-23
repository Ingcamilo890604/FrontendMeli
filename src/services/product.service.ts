import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, RelatedProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor() { }

  getProduct(id: string): Observable<Product> {
    // Mock data - replace with actual HTTP call
    const mockProduct: Product = {
      id: 'MLA123456789',
      title: 'Samsung Galaxy A55 5G Dual SIM 256 GB azul oscuro 8 GB RAM',
      price: 439,
      originalPrice: 599,
      currency: 'US$',
      condition: 'Nuevo',
      availableQuantity: 150,
      soldQuantity: 500,
      description: `Capacidad y eficiencia
Con su potente procesador y 8 GB de RAM, su computadora logrará un alto rendimiento con una alta velocidad de transmisión de contenido y ejecutar varias aplicaciones al mismo tiempo, sin demoras.

Capacidad de almacenamiento ilimitada
Olvídate de borrar. Con su memoria interna de 256 GB puedes descargar todos los archivos y aplicaciones que necesites, guardar fotos y almacenar tus películas, series y videos favoritos para reproducirlos cuando quieras.`,
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg', alt: 'Samsung Galaxy A55 frontal' },
        { id: '2', url: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg', alt: 'Samsung Galaxy A55 trasera' },
        { id: '3', url: 'https://images.pexels.com/photos/3394873/pexels-photo-3394873.jpeg', alt: 'Samsung Galaxy A55 lateral' },
        { id: '4', url: 'https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg', alt: 'Samsung Galaxy A55 pantalla' }
      ],
      specifications: [
        { name: 'Tamaño de la pantalla', value: '6.6" (16.7 cm x 77.4 mm x 8.2 mm)' },
        { name: 'Memoria interna', value: '256 GB' },
        { name: 'Cámara trasera principal', value: '50 Mpx' },
        { name: 'Con NFC', value: 'Sí' }
      ],
      seller: {
        id: 'seller123',
        name: 'Samsung',
        reputation: {
          level: 'Platinum',
          positivePercentage: 99,
          totalTransactions: 50000
        },
        location: 'Capital Federal',
        isOfficialStore: true
      },
      shipping: {
        freeShipping: true,
        estimatedDays: '2-3 días',
        methods: ['Envío gratis', 'Retiro en punto']
      },
      paymentMethods: [
        { id: '1', name: 'Visa', type: 'card', installments: 12, icon: '💳' },
        { id: '2', name: 'Mastercard', type: 'card', installments: 12, icon: '💳' },
        { id: '3', name: 'Efectivo', type: 'cash', icon: '💵' }
      ],
      rating: {
        average: 4.5,
        totalReviews: 12450
      },
      breadcrumb: [
        { label: 'Inicio', url: '/' },
        { label: 'Celulares', url: '/celulares' },
        { label: 'Samsung', url: '/celulares/samsung' },
        { label: 'Galaxy A55' }
      ]
    };

    return of(mockProduct);
  }

  getRelatedProducts(): Observable<RelatedProduct[]> {
    // Mock data - replace with actual HTTP call
    const mockRelatedProducts: RelatedProduct[] = [
      {
        id: 'related1',
        title: 'Samsung Galaxy M55 5G 256GB Dual SIM Telefakono',
        price: 421,
        currency: 'US$',
        image: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg',
        condition: 'Nuevo',
        freeShipping: true
      },
      {
        id: 'related2',
        title: 'Motorola Edge 50 Fusion 5G 256 GB Azul Artico 8 GB Ram',
        price: 419,
        currency: 'US$',
        image: 'https://images.pexels.com/photos/3394873/pexels-photo-3394873.jpeg',
        condition: 'Nuevo',
        freeShipping: true
      },
      {
        id: 'related3',
        title: 'Samsung Galaxy A36 5G 8gb 256GB Nezal Turaia',
        price: 326,
        currency: 'US$',
        image: 'https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg',
        condition: 'Nuevo',
        freeShipping: true
      }
    ];

    return of(mockRelatedProducts);
  }
}