import { Provider } from '@angular/core';
import { ProductRepository } from '../repositories/product.repository';
import { ProductHttpRepository } from '../repositories/product-http.repository';

/**
 * Application providers
 * This array configures the dependency injection for the application
 */
export const appProviders: Provider[] = [
  // When ProductRepository is requested, provide ProductHttpRepository
  {
    provide: ProductRepository,
    useClass: ProductHttpRepository
  }
];