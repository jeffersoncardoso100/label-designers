// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-text-modal',
//   imports: [FormsModule],
//   templateUrl: './text-modal.component.html',
//   styleUrls: ['./text-modal.component.css']
// })
// export class TextModalComponent {
//   /** Texto que será mostrado no modal */
//   @Input() textContent: string = '';

//   /** Tamanho da fonte do texto */
//   @Input() textSize: number = 10;

//   /** Emissor de evento para atualizar o conteúdo do texto no componente pai */
//   @Output() textContentChange = new EventEmitter<string>();

//   /** Emissor de evento para atualizar o tamanho do texto no componente pai */
//   @Output() textSizeChange = new EventEmitter<number>();

//   /** Emissor de evento para notificar que o texto foi adicionado */
//   @Output() addTextEvent = new EventEmitter<void>();

//   /** Emissor de evento para notificar que o modal foi fechado */
//   @Output() closeModalEvent = new EventEmitter<void>();

//   /** 
//    * Atualiza o conteúdo do texto e emite a alteração para o componente pai
//    * @param value O novo conteúdo do texto
//    */
//   public updateTextContent(value: string): void {
//     this.textContentChange.emit(value); // Emite o novo valor do texto
//   }

//   /** 
//    * Atualiza o tamanho da fonte do texto e emite a alteração para o componente pai
//    * @param value O novo tamanho da fonte
//    */
//   public updateTextSize(value: number): void {
//     this.textSizeChange.emit(Number(value)); // Emite o novo valor do tamanho
//   }

//   /** 
//    * Emite um evento para adicionar o texto
//    */
//   public addText(): void {
//     this.addTextEvent.emit(); // Notifica que o texto foi adicionado
//   }

//   /** 
//    * Emite um evento para fechar o modal
//    */
//   public closeModal(): void {
//     this.closeModalEvent.emit(); // Notifica que o modal deve ser fechado
//   }
// }import { Component } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-modal',
  imports: [FormsModule],
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.css']
})
export class TextModalComponent implements OnInit {
  showModal: boolean = false;
  modalData: any = {};

  textContent: string = ''; 
  textSize: number = 40; 

  @Output() textContentChange = new EventEmitter<string>(); 
  @Output() textSizeChange = new EventEmitter<number>(); 

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    // Ouvir os eventos do serviço de modal
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'text' && state.open) {
        this.modalData = state.data;
        this.showModal = true;
      } else if (state.modalType === 'text' && !state.open) {
        this.showModal = false;
      }
    });
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  addText(): void {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const text = document.createElement('div');
      // Agora usamos diretamente o textContent e textSize do componente
      text.textContent = this.textContent || 'Texto padrão';  // Usa a variável de texto
      text.style.position = 'absolute';
      text.style.top = '150px';  // Ajuste conforme necessário
      text.style.left = '150px';  // Ajuste conforme necessário
      text.style.fontSize = `${this.textSize || 10}px`;  // Usa a variável de tamanho de fonte
  
      text.style.cursor = 'move';  // Para indicar que o elemento pode ser movido
  
      // Variáveis para controlar o movimento
      let offsetX: number = 0;
      let offsetY: number = 0;
      let isMoving = false;
  
      // Adiciona o evento de mouse para iniciar o movimento
      text.addEventListener('mousedown', (event: MouseEvent) => {
        isMoving = true;
        offsetX = event.clientX - parseInt(text.style.left || '0', 10);
        offsetY = event.clientY - parseInt(text.style.top || '0', 10);
        text.style.cursor = 'grabbing';  // Mudar cursor durante o movimento
      });
  
      // Atualiza a posição do elemento enquanto está sendo movido
      document.addEventListener('mousemove', (event: MouseEvent) => {
        if (isMoving) {
          text.style.left = `${event.clientX - offsetX}px`;
          text.style.top = `${event.clientY - offsetY}px`;
        }
      });
  
      // Para o movimento quando o mouse é solto
      document.addEventListener('mouseup', () => {
        isMoving = false;
        text.style.cursor = 'move';  // Restaura o cursor
      });
  
      canvas.appendChild(text);  // Adiciona o texto ao canvas
    }
    this.closeModal();  // Fecha o modal
  }
  
  

  // Emitir eventos quando o conteúdo ou tamanho do texto mudar
  onTextContentChange(newText: string): void {
    this.textContent = newText;
    this.textContentChange.emit(newText);
  }

  onTextSizeChange(newSize: number): void {
    this.textSize = newSize;
    this.textSizeChange.emit(newSize);
  }
}