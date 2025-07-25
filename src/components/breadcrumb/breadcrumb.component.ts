import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbItem } from '../../models/product.model';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}