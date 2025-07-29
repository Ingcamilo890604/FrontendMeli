import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

export interface ColorOption {
  color: string;
  code: string;
  isActive: boolean;
}

@Component({
  selector: 'app-color-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.css']
})
export class ColorSelectorComponent {
  @Input() product: Product | null = null;
  @Output() colorSelected = new EventEmitter<string>();
  
  colorOptions: ColorOption[] = [
    { color: 'azul oscuro', code: '#1a1a2e', isActive: true },
    { color: 'azul medio', code: '#4a4a6e', isActive: false },
    { color: 'azul claro', code: '#7a7a9e', isActive: false }
  ];
  
  selectColor(option: ColorOption): void {
    // Deactivate all options
    this.colorOptions.forEach(opt => opt.isActive = false);
    // Activate the selected option
    option.isActive = true;
    // Emit the selected color
    this.colorSelected.emit(option.color);
  }
  
  getActiveColorName(): string {
    const activeOption = this.colorOptions.find(opt => opt.isActive);
    return activeOption ? activeOption.color : 'No seleccionado';
  }
}