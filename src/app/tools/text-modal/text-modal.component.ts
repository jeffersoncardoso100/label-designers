
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
        this.textContent = this.modalData.content || ''; // Garantir que o conteúdo do texto seja carregado
        this.textSize = this.modalData.size || 40; // Garantir que o tamanho seja carregado
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

  onTextSizeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.textSize = Number(inputElement.value);
      this.textSizeChange.emit(this.textSize);
    }
  }
  
  // Atualiza o tamanho do texto quando o usuário digita diretamente o valor
  onTextSizeChangeManual(value: string): void {
    const newSize = Number(value);
    if (!isNaN(newSize) && newSize >= 10 && newSize <= 200) {
      this.textSize = newSize;
      this.textSizeChange.emit(this.textSize);
    }
  }
  
  // Retorna a cor dinâmica do slider
  getSliderBackground(): string {
    const percentage = ((this.textSize - 10) / (200 - 10)) * 100;
    return `linear-gradient(90deg, 
            #ff0000 0%, 
            #ff9900 ${percentage / 3}%, 
            #33cc33 ${percentage}%)`;
  }
}  