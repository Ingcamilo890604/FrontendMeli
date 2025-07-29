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

}