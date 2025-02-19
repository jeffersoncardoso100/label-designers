import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service'; // Serviço para gerenciar o estado dos modais

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

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.css'],
  imports: [ImageModalComponent, TextModalComponent, CommonModule, SidebarComponent, ZplGeneratorComponent, PngGeneratorComponent, BmpGeneratorComponent, RulerComponent, ShapeModalComponent]
})
export class CanvasEditorComponent implements OnInit {
  shapes: any[] = [];
  showTextModal: boolean = false;
  showImageModal: boolean = false;
  showZPLModal: boolean = false;
  showPNGModal: boolean = false;
  showBMPModal: boolean = false;
  selectedTextElement: HTMLElement | null = null;

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
          shapeElement.style.zIndex = '1'; // Formas começam no fundo
  
          canvas.appendChild(shapeElement);
  
          shapeElement.addEventListener('mousedown', (event) =>
            this.startDrag(event, shapeElement as HTMLElement, shape)
          );
        }
  
        shapeElement.style.border = `${shape.borderWidth} solid ${shape.borderColor}`;
        shapeElement.style.backgroundColor = 'transparent'; // Fundo transparente
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
            // Para o círculo, ajustamos só o tamanho (width = height)
            shapeElement.style.width = `${shape.width || 100}px`;  // tamanho ajustado
            shapeElement.style.height = `${shape.width || 100}px`; // tamanho ajustado
            shapeElement.style.borderRadius = '50%'; // Fazendo a borda arredondada
            break;
          case 'triangle':
            shapeElement.style.width = '0';
            shapeElement.style.height = '0';
            shapeElement.style.borderLeft = `${shape.width / 2 || 50}px solid transparent`;
            shapeElement.style.borderRight = `${shape.width / 2 || 50}px solid transparent`;
            shapeElement.style.borderBottom = `${shape.height || 100}px solid ${shape.borderColor}`;
            break;
          default:
            console.error('Tipo de forma desconhecido:', shape.type);
            break;
        }
  
        // Traz a forma para frente ao clicar
        shapeElement.addEventListener('click', () => {
          shapeElement.style.zIndex = '3';
        });
      });
    }
  }
  
  

  startDrag(event: MouseEvent, shape: HTMLElement, shapeData: any): void {
    // Obtém a posição inicial do mouse em relação ao viewport
    const startX = event.clientX;
    const startY = event.clientY;
  
    // Obtém a posição inicial do elemento em relação ao viewport
    const rect = shape.getBoundingClientRect();
    const elementStartX = rect.left;
    const elementStartY = rect.top;
  
    // Calcula o offset entre o clique do mouse e a posição do elemento
    const offsetX = startX - elementStartX;
    const offsetY = startY - elementStartY;
  
    const onMouseMove = (moveEvent: MouseEvent) => {
      // Calcula a nova posição do mouse
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;
  
      // Atualiza a posição do elemento
      shape.style.left = `${newX}px`;
      shape.style.top = `${newY}px`;
  
      // Atualiza os dados da forma para refletir a nova posição
      shapeData.left = newX;
      shapeData.top = newY;
    };
  
    const onMouseUp = () => {
      // Remove os listeners de movimento e soltura do mouse
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  
    // Adiciona os listeners para o movimento e soltura do mouse
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  
    // Previne o comportamento padrão do evento
    event.preventDefault();
  }

  addShape(type: string, borderWidth: string, borderColor: string): void {
    const shape = { 
      type, 
      borderWidth, 
      borderColor, 
      left: 0, 
      top: 0 
    };

    this.shapeService.addShape(shape);
  }

  toggleSize(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    element.classList.toggle('expanded');
  }
}