import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ShapeService } from '../../services/shapes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shape-modal',
  standalone: true, // Adicionado para standalone components
  imports: [FormsModule, CommonModule],
  templateUrl: './shape-modal.component.html',
  styleUrls: ['./shape-modal.component.css']
})
export class ShapeModalComponent {
  showModal: boolean = false;
  shapeType: string = 'square';
  width: number = 100;
  height: number = 100;
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

  onShapeTypeChange(): void {
    if (this.shapeType === 'circle') {
      this.height = this.width;
    }
    this.updateShapePreview();
  }

  updateShapeSize(): void {
    if (this.shapeType === 'circle') {
      this.height = this.width;
    }
    this.updateShapePreview();
  }

  updateShapePreview(): void {
    if (this.shapeType === 'triangle') {
      const triangle = document.querySelector('.preview-triangle') as HTMLElement;
      if (triangle) {
        const halfWidth = this.width / 2;
        const triangleHeight = (this.width * Math.sqrt(3)) / 2; // Altura de um triângulo equilátero
        triangle.style.borderWidth = `0 ${halfWidth}px ${triangleHeight}px ${halfWidth}px`;
        triangle.style.borderColor = `transparent transparent ${this.fillColor} transparent`;
        triangle.style.setProperty('--fill-color', this.fillColor);
      }
    }
  }

  applyChanges(): void {
    const shape = {
      type: this.shapeType,
      width: this.width,
      height: this.shapeType === 'circle' ? this.width : this.height,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      fillColor: this.fillColor
    };

    this.shapeService.addShape(shape);
    this.shapeAdded.emit(shape); // Emite o evento, se necessário
    this.closeModal();
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.showModal = false;
  }

  getShapeWidthSliderBackground(): string {
    const percentage = ((this.width - 50) / (300 - 50)) * 100;
    const redStop = percentage * 0.8;
    const whiteStop = percentage;
    return `linear-gradient(90deg, rgb(222, 56, 56) ${redStop}%, rgb(255, 255, 255) ${whiteStop}%)`;
  }

  getShapeHeightSliderBackground(): string {
    const percentage = ((this.height - 50) / (300 - 50)) * 100;
    const redStop = percentage * 0.8;
    const whiteStop = percentage;
    return `linear-gradient(90deg, rgb(222, 56, 56) ${redStop}%, rgb(255, 255, 255) ${whiteStop}%)`;
  }
}