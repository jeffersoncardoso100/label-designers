import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ShapeService } from '../../services/shapes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shape-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './shape-modal.component.html',
  styleUrls: ['./shape-modal.component.css']
})
export class ShapeModalComponent implements OnInit {
  showModal: boolean = false;
  shapeType: string = 'square';
  width: number = 100;
  height: number = 100; // Valor inicial padrão
  borderWidth: string = '1px';
  borderColor: string = '#000000';
  fillColor: string = '#ffffff';

  @Output() shapeAdded = new EventEmitter<any>();

  private readonly defaultSettings = {
    shapeType: 'square',
    width: 100,
    height: 100,
    borderWidth: '1px',
    borderColor: '#000000',
    fillColor: '#ffffff'
  };

  constructor(
    private modalService: ModalService,
    private shapeService: ShapeService
  ) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'shape') {
        this.showModal = state.open;
        if (state.open) {
          this.resetToDefaults();
          this.updateShapePreview();
        }
      }
    });
  }

  resetToDefaults(): void {
    this.shapeType = this.defaultSettings.shapeType;
    this.width = this.defaultSettings.width;
    this.height = this.defaultSettings.height;
    this.borderWidth = this.defaultSettings.borderWidth;
    this.borderColor = this.defaultSettings.borderColor;
    this.fillColor = this.defaultSettings.fillColor;
  }

  onShapeTypeChange(): void {
    if (this.shapeType === 'circle' || this.shapeType === 'square') {
      this.height = this.width; // Força altura = largura apenas para círculo e quadrado
    }
    // Para retângulo, não faz nada, permitindo que height seja ajustado independentemente
    this.updateShapePreview();
  }

  updateShapeSize(): void {
    if (this.shapeType === 'circle' || this.shapeType === 'square') {
      this.height = this.width; // Sincroniza apenas para círculo e quadrado
    }
    // Para retângulo, deixa height como está, permitindo ajustes independentes
    this.updateShapePreview();
  }

  updateShapePreview(): void {
    const previewElement = document.querySelector('.shape-preview') as HTMLElement;
    if (previewElement) {
      previewElement.classList.remove('preview-square', 'preview-rectangle', 'preview-circle', 'preview-triangle');
      previewElement.style.border = '';
      previewElement.style.width = '';
      previewElement.style.height = '';

      if (this.shapeType === 'square' || this.shapeType === 'rectangle' || this.shapeType === 'circle') {
        previewElement.style.width = `${this.width}px`;
        previewElement.style.height = `${this.height}px`; // Usa height diretamente, sem condições extras
        previewElement.style.border = `${this.borderWidth} solid ${this.borderColor}`;
        previewElement.style.backgroundColor = this.fillColor;

        if (this.shapeType === 'square') {
          previewElement.classList.add('preview-square');
        } else if (this.shapeType === 'rectangle') {
          previewElement.classList.add('preview-rectangle');
        } else if (this.shapeType === 'circle') {
          previewElement.classList.add('preview-circle');
        }
      } else if (this.shapeType === 'triangle') {
        previewElement.classList.add('preview-triangle');
        const halfWidth = this.width / 2;
        const triangleHeight = (this.width * Math.sqrt(3)) / 2;
        previewElement.style.width = '0';
        previewElement.style.height = '0';
        previewElement.style.borderStyle = 'solid';
        previewElement.style.borderWidth = `0 ${halfWidth}px ${triangleHeight}px ${halfWidth}px`;
        previewElement.style.borderColor = `transparent transparent ${this.fillColor} transparent`;
        previewElement.style.backgroundColor = 'transparent';
        previewElement.style.position = 'relative';
        previewElement.style.setProperty('--border-width', this.borderWidth);
        previewElement.style.setProperty('--border-color', this.borderColor);
      }
    }
  }

  applyChanges(): void {
    const shape = {
      type: this.shapeType,
      width: this.width,
      height: this.shapeType === 'circle' ? this.width : this.height, // Garante círculo com height = width
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      fillColor: this.fillColor,
      top: 150,
      left: 150
    };

    this.shapeService.addShape(shape);
    this.shapeAdded.emit(shape);
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