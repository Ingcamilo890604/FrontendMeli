import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbItem } from '../../models/product.model';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="breadcrumb" *ngIf="items.length > 0">
      <span *ngFor="let item of items; let last = last" class="breadcrumb-item">
        <a *ngIf="item.url && !last" [href]="item.url" class="breadcrumb-link">
          {{ item.label }}
        </a>
        <span *ngIf="!item.url || last" class="breadcrumb-current">
          {{ item.label }}
        </span>
        <span *ngIf="!last" class="breadcrumb-separator">></span>
      </span>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 16px;
      padding: 8px 0;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
    }

    .breadcrumb-link {
      color: #3483FA;
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      text-decoration: underline;
    }

    .breadcrumb-current {
      color: #666;
    }

    .breadcrumb-separator {
      margin: 0 8px;
      color: #999;
    }

    @media (max-width: 768px) {
      .breadcrumb {
        font-size: 12px;
        overflow-x: auto;
        white-space: nowrap;
      }
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}