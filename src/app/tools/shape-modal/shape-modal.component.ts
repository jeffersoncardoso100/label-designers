import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ShapeService } from '../../services/shapes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shape-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './shape-modal.component.html',
  styleUrls: ['./shape-modal.component.css']
})
export class ShapeModalComponent {
  showModal: boolean = false;
  shapeType: string = 'square';
  width: number = 100;  // Default width
  height: number = 100; // Default height
  borderWidth: string = '1px';
  borderColor: string = '#000000';
  fillColor: string = '#ffffff';

  @Output() shapeAdded = new EventEmitter<any>();

  constructor(
    private modalService: ModalService,
    private shapeService: ShapeService
  ) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'shape' && state.open) {
        this.showModal = true;
      } else if (state.modalType === 'shape' && !state.open) {
        this.showModal = false;
      }
    });
  }

  // Este método é chamado quando o tipo de forma é alterado
  onShapeTypeChange(): void {
    if (this.shapeType === 'circle') {
      // Quando for círculo, a altura deve ser igual à largura
      this.height = this.width;
    }
  }

  updateShapeSize(): void {
    // Se for círculo, altura será igual à largura
    if (this.shapeType === 'circle') {
      this.height = this.width;
    }
  
    const shape = document.getElementById('shapeElement');
    if (shape) {
      shape.style.width = `${this.width}px`;
      shape.style.height = `${this.height}px`;
    }
  }
  

  applyChanges(): void {
    const shape = {
      type: this.shapeType,
      width: this.width,
      height: this.shapeType === 'circle' ? this.width : this.height,  // Para círculos, a altura é igual à largura
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      fillColor: this.fillColor
    };
  
    this.shapeService.addShape(shape);
    
  }
  closeModal(): void {
    this.modalService.closeModal();
    this.showModal = false;
  }

  getShapeWidthSliderBackground(): string {
    const percentage = (this.width - 50) / (300 - 50) * 100;
    const redStop = (percentage * 0.8);
    const whiteStop = percentage;
  
    return `linear-gradient(90deg, 
      rgb(222, 56, 56) ${redStop}%, 
      rgb(255, 255, 255) ${whiteStop}%)`;
  }
  
  getShapeHeightSliderBackground(): string {
    const percentage = (this.height - 50) / (300 - 50) * 100;
    const redStop = (percentage * 0.8);
    const whiteStop = percentage;
  
    return `linear-gradient(90deg, 
      rgb(222, 56, 56) ${redStop}%, 
      rgb(255, 255, 255) ${whiteStop}%)`;
  }
}