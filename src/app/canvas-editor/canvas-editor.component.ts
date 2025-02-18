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

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.css'],
  imports: [ImageModalComponent, TextModalComponent, CommonModule, SidebarComponent, ZplGeneratorComponent, PngGeneratorComponent, BmpGeneratorComponent, RulerComponent]
})
export class CanvasEditorComponent implements OnInit {
  // Variáveis para controlar a visibilidade dos modais
  showTextModal: boolean = false;
  showImageModal: boolean = false;
  showZPLModal: boolean = false;
  showPNGModal: boolean = false;
  showBMPModal: boolean = false;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    // Subscrição para ouvir os eventos de mudança de estado do modal
    this.modalService.modalState$.subscribe(state => {
      console.log('Estado do Modal:', state); // Verificando a alteração no estado

      /** Manipula o estado para o modal de TEXTO */
      if (state.modalType === 'text' && state.open) {
        this.showTextModal = true;
      } else if (state.modalType === 'text' && !state.open) {
        this.showTextModal = false;
      }

      /** Manipula o estado para o modal de IMAGEM */
      if (state.modalType === 'image' && state.open) {
        this.showImageModal = true;
      } else if (state.modalType === 'image' && !state.open) {
        this.showImageModal = false;
      }

      /** Manipula o estado para o modal de ZPL */
      if (state.modalType === 'zpl' && state.open) {
        this.showZPLModal = true;
      } else if (state.modalType === 'zpl' && !state.open) {
        this.showZPLModal = false;
      }

      /** Manipula o estado para o modal de PNG */
      if (state.modalType === 'png' && state.open) {
        this.showPNGModal = true;
      } else if (state.modalType === 'png' && !state.open) {
        this.showPNGModal = false;
      }

      /** Manipula o estado para o modal de BMP */
      if (state.modalType === 'bmp' && state.open) {
        this.showBMPModal = true;
      } else if (state.modalType === 'bmp' && !state.open) {
        this.showBMPModal = false;
      }
    });
  }

  // Abre o modal de texto, acionando o ModalService
  openTextModal(): void {
    this.modalService.openModal('text', { content: '', size: 12 });
  }

  // Abre o modal de imagem, acionando o ModalService
  openImageModal(): void {
    this.modalService.openModal('image', { imageUrl: null });
  }

  // Método para adicionar o texto ao canvas (usando os dados do modal)
// Método para adicionar o texto ao canvas (usando os dados do modal)
addText(content: string, size: number): void {
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const text = document.createElement('div');
    text.textContent = content || 'Novo texto!';
    text.contentEditable = 'true';
    text.style.position = 'absolute';
    text.style.top = '100px';
    text.style.left = '100px';
    text.style.fontSize = `${size}px`;
    text.style.cursor = 'move';
    text.classList.add('text-element'); // Adiciona uma classe para identificar os textos
    
    // Atributo customizado para armazenar as informações do texto
    text.setAttribute('data-content', content);
    text.setAttribute('data-size', size.toString());

    // Adiciona o evento de clique no texto
    text.addEventListener('click', () => {
      this.selectTextElement(text);  // Abre o modal com as informações do texto
    });

    text.addEventListener('mousedown', (event) => this.startDrag(event, text));

    canvas.appendChild(text);
  }
}




  // Método para mover o texto dentro do canvas
  startDrag(event: MouseEvent, text: HTMLElement): void {
    const offsetX = event.clientX - text.getBoundingClientRect().left;
    const offsetY = event.clientY - text.getBoundingClientRect().top;

    const onMouseMove = (moveEvent: MouseEvent) => {
      text.style.left = `${moveEvent.clientX - offsetX}px`;
      text.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // Método para adicionar uma imagem ao canvas (usando os dados do modal)
  // Método para selecionar o texto e abrir o modal
selectTextElement(element: HTMLElement): void {
  const textContent = element.getAttribute('data-content') || '';
  const textSize = parseInt(element.getAttribute('data-size') || '12', 10);

  // Abre o modal de texto com as informações do elemento
  this.modalService.openModal('text', { content: textContent, size: textSize });
}

// Método para selecionar a imagem e abrir o modal
selectImageElement(element: HTMLElement): void {
  const imageUrl = element.getAttribute('data-imageUrl') || '';
  
  // Abre o modal de imagem com a URL da imagem
  this.modalService.openModal('image', { imageUrl });
}


  toggleSize(event: MouseEvent) {
    const element = event.target as HTMLElement;
    element.classList.toggle('expanded'); // Alterna a classe 'expanded' ao clicar
  }
}
