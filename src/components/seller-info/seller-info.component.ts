import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';

@Component({
  selector: 'app-seller-info',
  standalone: true,
  imports: [CommonModule, PaymentMethodComponent],
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.css']
})
export class SellerInfoComponent implements OnChanges {
  @Input() product: Product | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      console.log('Product in seller-info component:', this.product);
      console.log('Payment methods in seller-info component:', this.product?.paymentMethods);
    }
  }
}