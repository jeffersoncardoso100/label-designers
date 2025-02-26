import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { ImageModalComponent } from "../tools/image-modal/image-modal.component";
import { TextModalComponent } from "../tools/text-modal/text-modal.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ZplGeneratorComponent } from "../Returns/zpl-generator/zpl-generator.component";
import { PngGeneratorComponent } from "../Returns/png-generator/png-generator.component";
import { BmpGeneratorComponent } from '../Returns/bmp-generator/bmp-generator.component';
import { RulerComponent } from './ruler/ruler.component';
import { ShapeService } from '../services/shapes.service';
import { ShapeModalComponent } from "../tools/shape-modal/shape-modal.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.css'],
  imports: [
    ImageModalComponent, 
    TextModalComponent, 
    CommonModule, 
    SidebarComponent, 
    ZplGeneratorComponent, 
    PngGeneratorComponent, 
    BmpGeneratorComponent, 
    RulerComponent, 
    ShapeModalComponent, 
    FormsModule
  ]
})
export class CanvasEditorComponent implements OnInit {
  shapes: any[] = [];
  texts: any[] = [];
  showTextModal: boolean = false;
  showImageModal: boolean = false;
  showZPLModal: boolean = false;
  showPNGModal: boolean = false;
  showBMPModal: boolean = false;
  selectedTextElement: HTMLElement | null = null;

  canvasWidth: number = 100;  // Tamanho real em mm
  canvasHeight: number = 80;  // Tamanho real em mm
  isExpanded: boolean = false; // Estado de expansão
  private readonly MM_TO_PX = 7.992125984; // Conversão de mm para px
  private readonly EXPANSION_FACTOR = 2;   // Fator de expansão (ex.: 2x)

  constructor(private modalService: ModalService, private shapeService: ShapeService) {}

  ngOnInit(): void {
    this.shapeService.currentShapes.subscribe(shapes => {
      this.shapes = shapes;
      this.renderShapes();
    });

    this.modalService.modalState$.subscribe(state => {
      console.log('Estado do Modal:', state);
      if (state.modalType === 'text') this.showTextModal = state.open;
      else if (state.modalType === 'image') this.showImageModal = state.open;
      else if (state.modalType === 'zpl') this.showZPLModal = state.open;
      else if (state.modalType === 'png') this.showPNGModal = state.open;
      else if (state.modalType === 'bmp') this.showBMPModal = state.open;
    });

    this.updateCanvasSize();
  }

  updateCanvasSize(): void {
    const canvas = document.getElementById('canvas') as HTMLElement;
    if (canvas) {
      const minWidthMm = 50;
      const minHeightMm = 50;
      const maxWidthMm = 500;
      const maxHeightMm = 500;
  
      // Limita os valores de largura e altura
      const widthMm = Math.min(Math.max(this.canvasWidth, minWidthMm), maxWidthMm);
      const heightMm = Math.min(Math.max(this.canvasHeight, minHeightMm), maxHeightMm);
  
      // Converte de mm para px
      const widthPx = widthMm * this.MM_TO_PX;
      const heightPx = heightMm * this.MM_TO_PX;
  
      // Define o tamanho do canvas diretamente
      canvas.style.width = `${widthPx}px`;
      canvas.style.height = `${heightPx}px`;
      console.log(this.canvasWidth)
  
      // Remove a escala para redimensionamento real (ajuste apenas visual se necessário)
      const scale = this.isExpanded ? this.EXPANSION_FACTOR : 1;
      canvas.style.transform = `scale(${scale})`;

      canvas.style.transformOrigin = 'top left'; // Origem fixa no topo esquerdo
  
      // Ajusta a classe small, se necessário
      if (widthMm <= 75 || heightMm <= 75) {
        canvas.classList.add('small');
      } else {
        canvas.classList.remove('small');
      }
  
      // Renderiza formas e textos após o redimensionamento
      this.renderShapes();
      this.renderTexts();
    }
  }

  onSizeChange(): void {
    this.updateCanvasSize();
  }

  expandCanvas(dimension: 'width' | 'height', amountMm: number): void {
    const minSizeMm = 40;
    const maxSizeMm = 500;

    if (dimension === 'width') {
      this.canvasWidth = Math.min(Math.max(this.canvasWidth + amountMm, minSizeMm), maxSizeMm);
    } else if (dimension === 'height') {
      this.canvasHeight = Math.min(Math.max(this.canvasHeight + amountMm, minSizeMm), maxSizeMm);
    }
    this.updateCanvasSize();
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
    this.updateCanvasSize();
  }

  renderShapes(): void {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      this.shapes.forEach((shape, index) => {
        let shapeElement = document.getElementById(`shape-${index}`);
        if (!shapeElement) {
          shapeElement = document.createElement('div');
          shapeElement.id = `shape-${index}`;
          shapeElement.style.position = 'absolute';
          shapeElement.style.zIndex = '1';
          canvas.appendChild(shapeElement);
          shapeElement.addEventListener('mousedown', (event) =>
            this.startDrag(event, shapeElement as HTMLElement, shape)
          );
        }

        shapeElement.style.border = `${shape.borderWidth} solid ${shape.borderColor}`;
        shapeElement.style.backgroundColor = 'transparent';
        shapeElement.style.top = `${shape.top || 0}px`;
        shapeElement.style.left = `${shape.left || 0}px`;

        switch (shape.type) {
          case 'square':
            shapeElement.style.width = `${shape.width || 100}px`;
            shapeElement.style.height = `${shape.height || 100}px`;
            break;
          case 'rectangle':
            shapeElement.style.width = `${shape.width || 150}px`;
            shapeElement.style.height = `${shape.height || 100}px`;
            break;
          case 'circle':
            shapeElement.style.width = `${shape.width || 100}px`;
            shapeElement.style.height = `${shape.width || 100}px`;
            shapeElement.style.borderRadius = '50%';
            break;
          case 'triangle':
            shapeElement.style.width = '0';
            shapeElement.style.height = '0';
            shapeElement.style.borderLeft = `${(shape.width || 100) / 2}px solid transparent`;
            shapeElement.style.borderRight = `${(shape.width || 100) / 2}px solid transparent`;
            shapeElement.style.borderBottom = `${shape.height || 100}px solid ${shape.borderColor}`;
            break;
          default:
            console.error('Tipo de forma desconhecido:', shape.type);
            break;
        }

        shapeElement.addEventListener('click', () => {
          shapeElement.style.zIndex = '3';
        });
      });
    }
  }


  renderTexts(): void {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      this.texts.forEach((text, index) => {
        let textElement = document.getElementById(`text-${index}`);
        if (!textElement) {
          textElement = document.createElement('div');
          textElement.id = `text-${index}`;
          textElement.style.position = 'absolute';
          textElement.style.zIndex = '2';
          textElement.style.cursor = 'move';
          textElement.textContent = text.content || 'Texto Padrão';
          canvas.appendChild(textElement);
          textElement.addEventListener('mousedown', (event) =>
            this.startDrag(event, textElement as HTMLElement, text)
          );
        }

        textElement.style.top = `${text.top || 0}px`;
        textElement.style.left = `${text.left || 0}px`;
        textElement.style.fontSize = `${text.fontSize || 16}px`;
        textElement.style.color = text.color || '#000000';
        textElement.style.userSelect = 'none';
      });
    }
  }



  startDrag(event: MouseEvent, element: HTMLElement, data: any): void {
    const factor = this.isExpanded ? this.EXPANSION_FACTOR : 1;
    const startX = event.clientX / factor;
    const startY = event.clientY / factor;
    const rect = element.getBoundingClientRect();
    const elementStartX = rect.left / factor;
    const elementStartY = rect.top / factor;
    const offsetX = startX - elementStartX;
    const offsetY = startY - elementStartY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newX = (moveEvent.clientX / factor) - offsetX;
      const newY = (moveEvent.clientY / factor) - offsetY;
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      data.left = newX;
      data.top = newY;
    };


    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };


    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    event.preventDefault();
  }

  addText(content: string, fontSize: number = 16, color: string = '#000000'): void {
    const text = { content, fontSize, color, left: 0, top: 0 };
    this.texts.push(text);
    this.renderTexts();
  }

  addShape(type: string, borderWidth: string, borderColor: string): void {
    const shape = { type, borderWidth, borderColor, left: 0, top: 0, width: 100, height: 100 };
    this.shapeService.addShape(shape);
  }

  toggleSize(event: MouseEvent): void {
    const element = event.target as HTMLElement;

    element.classList.toggle('expanded');
  }

  openTextModal(): void {
    this.modalService.openModal('text');
  }
}


