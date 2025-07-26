import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, PaymentMethod } from '../../models/product.model';

// Interface for the payment methods in the API response
interface ApiPaymentMethod {
  id: string;
  name: string;
  description: string;
  type?: 'card' | 'cash' | 'transfer';
  installments?: number;
  icon?: string;
}

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnChanges {
  @Input() paymentMethods: any[] = [];
  processedPaymentMethods: PaymentMethod[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentMethods']) {
      console.log('Original payment methods in PaymentMethod component:', this.paymentMethods);
      
      // Process payment methods to ensure they have the required properties
      this.processPaymentMethods();
      
      console.log('Processed payment methods:', this.processedPaymentMethods);
      console.log('Card payment methods:', this.getPaymentMethodsByType('card'));
      console.log('Cash payment methods:', this.getPaymentMethodsByType('cash'));
      console.log('Transfer payment methods:', this.getPaymentMethodsByType('transfer'));
    }
  }
  
  /**
   * Process payment methods to ensure they have the required properties
   */
  processPaymentMethods(): void {
    if (!this.paymentMethods || this.paymentMethods.length === 0) {
      this.processedPaymentMethods = [];
      return;
    }
    
    this.processedPaymentMethods = this.paymentMethods.map(method => {
      // Check if the method already has the required properties
      if (method.type && method.icon) {
        return method as PaymentMethod;
      }
      
      // Create a new payment method with inferred properties
      const processedMethod: PaymentMethod = {
        id: method.id,
        name: method.name,
        type: this.inferPaymentMethodType(method),
        icon: this.getDefaultIcon(method),
        installments: method.installments || 0
      };
      
      return processedMethod;
    });
  }
  
  /**
   * Infer the payment method type based on the name or description
   * @param method The payment method
   * @returns The inferred type ('card', 'cash', or 'transfer')
   */
  inferPaymentMethodType(method: any): 'card' | 'cash' | 'transfer' {
    const name = method.name?.toLowerCase() || '';
    const description = method.description?.toLowerCase() || '';
    
    // Check for card-related keywords
    if (
      name.includes('tarjeta') || 
      name.includes('visa') || 
      name.includes('master') || 
      name.includes('amex') || 
      name.includes('american express') ||
      description.includes('visa') || 
      description.includes('master') || 
      description.includes('amex') || 
      description.includes('american express') ||
      name.includes('credit') || 
      name.includes('crédito') ||
      name.includes('débito') ||
      name.includes('debit')
    ) {
      return 'card';
    }
    
    // Check for cash-related keywords
    if (
      name.includes('efectivo') || 
      name.includes('cash') || 
      name.includes('pago fácil') || 
      name.includes('rapipago')
    ) {
      return 'cash';
    }
    
    // Check for transfer-related keywords
    if (
      name.includes('transfer') || 
      name.includes('transferencia') || 
      name.includes('banco') || 
      name.includes('bank') || 
      name.includes('paypal') ||
      description.includes('paypal')
    ) {
      return 'transfer';
    }
    
    // Default to card if we can't determine the type
    return 'card';
  }
  
  /**
   * Get a default icon for a payment method based on its type
   * @param method The payment method
   * @returns A default icon
   */
  getDefaultIcon(method: any): string {
    const type = method.type || this.inferPaymentMethodType(method);
    
    switch (type) {
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      case 'transfer':
        return '🏦';
      default:
        return '💰';
    }
  }
  
  /**
   * Filter payment methods by type
   * @param type The payment method type ('card', 'cash', or 'transfer')
   * @returns Array of payment methods of the specified type
   */
  getPaymentMethodsByType(type: 'card' | 'cash' | 'transfer'): PaymentMethod[] {
    if (!this.processedPaymentMethods || this.processedPaymentMethods.length === 0) {
      return [];
    }
    
    return this.processedPaymentMethods.filter(method => method.type === type);
  }
  
  /**
   * Get the maximum number of installments available for card payments
   * @returns The maximum number of installments, or 12 as default
   */
  getMaxInstallments(): number {
    if (!this.processedPaymentMethods || this.processedPaymentMethods.length === 0) {
      return 12; // Default value
    }
    
    const cardMethods = this.getPaymentMethodsByType('card');
    if (cardMethods.length === 0) {
      return 12; // Default value
    }
    
    // Find the maximum installments among all card payment methods
    const maxInstallments = Math.max(
      ...cardMethods
        .map(method => method.installments || 0)
    );
    
    return maxInstallments > 0 ? maxInstallments : 12; // Use default if no installments specified
  }
  
  /**
   * Get the CSS class for a card based on its name
   * @param name The card name
   * @returns The CSS class for the card
   */
  getCardClass(name: string): string {
    const normalizedName = name.toLowerCase();
    
    if (normalizedName.includes('visa')) {
      return 'visa';
    } else if (normalizedName.includes('master')) {
      return 'master';
    } else if (normalizedName.includes('oca')) {
      return 'oca';
    } else if (normalizedName.includes('amex') || normalizedName.includes('american')) {
      return 'amex';
    } else {
      // Return a default class or the normalized name as a fallback
      return normalizedName.replace(/\s+/g, '-');
    }
  }
  
  /**
   * Handle click on "Conoce otros medios de pago" link
   * @param event The click event
   */
  onSeeAllPaymentsClick(event: MouseEvent): void {
    // Prevent default link behavior
    event.preventDefault();
    
    // Log the click for debugging
    console.log('See all payments link clicked');
    
    // Here you would typically show a modal or navigate to a page with more payment methods
    // For now, we'll just log a message
    alert('Esta funcionalidad mostraría todos los medios de pago disponibles.');
  }
}