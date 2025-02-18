import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';
import { TextStyleService } from '../../services/text-style.service'; // Importe o serviço

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

  // Torne o serviço público para que possa ser acessado no template
  constructor(
    private modalService: ModalService, 
    public textStyleService: TextStyleService // Mudança para "public"
  ) { }

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
      text.textContent = this.textContent || 'Texto padrão';
      text.style.position = 'absolute';
      text.style.top = '150px'; 
      text.style.left = '150px';
      text.style.fontSize = `${this.textSize || 10}px`;  

      // Aplica os estilos através do serviço
      if (this.textStyleService.getBold()) {
        text.style.fontWeight = 'bold';
      }
      if (this.textStyleService.getItalic()) {
        text.style.fontStyle = 'italic';
      }
      if (this.textStyleService.getUnderline()) {
        text.style.textDecoration = 'underline';
      }

      text.style.cursor = 'move'; 

      let offsetX: number = 0;
      let offsetY: number = 0;
      let isMoving = false;

      text.addEventListener('mousedown', (event: MouseEvent) => {
        isMoving = true;
        offsetX = event.clientX - parseInt(text.style.left || '0', 10);
        offsetY = event.clientY - parseInt(text.style.top || '0', 10);
        text.style.cursor = 'grabbing';  
      });

      document.addEventListener('mousemove', (event: MouseEvent) => {
        if (isMoving) {
          text.style.left = `${event.clientX - offsetX}px`;
          text.style.top = `${event.clientY - offsetY}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        isMoving = false;
        text.style.cursor = 'move'; 
      });

      canvas.appendChild(text); 
    }
  }

  onBoldChange(event: Event): void {
    this.textStyleService.setBold((event.target as HTMLInputElement).checked);
  }

  onItalicChange(event: Event): void {
    this.textStyleService.setItalic((event.target as HTMLInputElement).checked);
  }

  onUnderlineChange(event: Event): void {
    this.textStyleService.setUnderline((event.target as HTMLInputElement).checked);
  }

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
  
  onTextSizeChangeManual(value: string): void {
    const newSize = Number(value);
    if (!isNaN(newSize) && newSize >= 10 && newSize <= 200) {
      this.textSize = newSize;
      this.textSizeChange.emit(this.textSize);
    }
  }

  getSliderBackground(): string {
    const percentage = ((this.textSize - 10) / (200 - 10)) * 100;
    return `linear-gradient(90deg, 
            #ff0000 0%, 
            #ff9900 ${percentage / 3}%, 
            #33cc33 ${percentage}%)`;
  }
}
