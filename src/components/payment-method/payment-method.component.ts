import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethod } from '../../models/product.model';

interface ApiPaymentMethod {
  id: string;
  name: string;
  description: string;
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
      this.processPaymentMethods();
    }
  }
  
  processPaymentMethods(): void {
    if (!this.paymentMethods || this.paymentMethods.length === 0) {
      this.processedPaymentMethods = [];
      return;
    }
    
    this.processedPaymentMethods = this.paymentMethods.map(method => {
      if (method.type && method.icon) {
        return method as PaymentMethod;
      }
      
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
  
  inferPaymentMethodType(method: any): 'card' | 'cash' | 'transfer' {
    const name = method.name?.toLowerCase() || '';
    const description = method.description?.toLowerCase() || '';
    
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
    
    if (
      name.includes('efectivo') || 
      name.includes('cash') || 
      name.includes('pago fácil') || 
      name.includes('rapipago')
    ) {
      return 'cash';
    }
    
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
    
    return 'card';
  }
  
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
  
  getPaymentMethodsByType(type: 'card' | 'cash' | 'transfer'): PaymentMethod[] {
    if (!this.processedPaymentMethods || this.processedPaymentMethods.length === 0) {
      return [];
    }
    
    return this.processedPaymentMethods.filter(method => method.type === type);
  }
  
  getMaxInstallments(): number {
    if (!this.processedPaymentMethods || this.processedPaymentMethods.length === 0) {
      return 12;
    }
    
    const cardMethods = this.getPaymentMethodsByType('card');
    if (cardMethods.length === 0) {
      return 12;
    }
    
    const maxInstallments = Math.max(
      ...cardMethods
        .map(method => method.installments || 0)
    );
    
    return maxInstallments > 0 ? maxInstallments : 12;
  }
  
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
      return normalizedName.replace(/\s+/g, '-');
    }
  }
  
  onSeeAllPaymentsClick(event: MouseEvent): void {
    event.preventDefault();
  }
}