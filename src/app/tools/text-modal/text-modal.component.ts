import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';
import { TextStyleService } from '../../services/text-style.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.css']
})
export class TextModalComponent implements OnInit {
  showModal: boolean = false;
  modalData: any = {};

  textContent: string = '';
  textSize: number = 40;
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  fontFamily: string = 'Arial'; // Fonte inicial
  fontList: string[] = ['Arial', 'Verdana', 'Courier New', 'Georgia', 'Times New Roman', 'Tahoma']; // Lista de fontes

  selectedElement: HTMLElement | null = null;

  @Output() textContentChange = new EventEmitter<string>();
  @Output() textSizeChange = new EventEmitter<number>();

  constructor(
    private modalService: ModalService,
    public textStyleService: TextStyleService
  ) { }

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'text' && state.open) {
        this.modalData = state.data;
        this.textContent = this.modalData.content || '';
        this.textSize = this.modalData.size || 40;
        this.isBold = this.modalData.isBold || false;
        this.isItalic = this.modalData.isItalic || false;
        this.isUnderline = this.modalData.isUnderline || false;
        this.fontFamily = this.modalData.fontFamily || 'Arial';
        this.showModal = true;
      } else if (state.modalType === 'text' && !state.open) {
        this.showModal = false;
      }
    });
  
    // Adicionar evento de clique duplo para edição direta
    document.addEventListener('dblclick', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('text-element')) {
        this.selectTextElement(target);
        target.setAttribute('contenteditable', 'true');
      }
    });
  }

  // Atualiza o conteúdo de texto em tempo real
  updateTextContent(): void {
    if (this.selectedElement) {
      this.selectedElement.textContent = this.textContent;
      this.selectedElement.setAttribute('data-content', this.textContent); // Salva a alteração no atributo
    }
  }

  // Atualiza o tamanho do texto em tempo real
  updateTextSize(): void {
    if (this.selectedElement) {
      this.selectedElement.style.fontSize = `${this.textSize}px`;
      this.selectedElement.setAttribute('data-size', this.textSize.toString()); // Salva a alteração no atributo
    }
  }

  // Atualiza a fonte do texto em tempo real
  updateFontFamily(): void {
    if (this.selectedElement) {
      this.selectedElement.style.fontFamily = this.fontFamily;
      this.selectedElement.setAttribute('data-font-family', this.fontFamily); // Salva a alteração no atributo
    }
  }

  // Método para aplicar estilos em tempo real
  updateTextStyles(): void {
    if (this.selectedElement) {
      this.selectedElement.style.fontWeight = this.isBold ? 'bold' : 'normal';
      this.selectedElement.style.fontStyle = this.isItalic ? 'italic' : 'normal';
      this.selectedElement.style.textDecoration = this.isUnderline ? 'underline' : 'none';

      // Salvando as propriedades de estilo
      this.selectedElement.setAttribute('data-bold', this.isBold.toString());
      this.selectedElement.setAttribute('data-italic', this.isItalic.toString());
      this.selectedElement.setAttribute('data-underline', this.isUnderline.toString());
    }
  }

  addText(content: string, size: number): void {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const text = document.createElement('div');
      text.textContent = content || 'Novo texto!';
      text.style.position = 'absolute';
      text.style.top = '100px';
      text.style.left = '100px';
      text.style.fontSize = `${size}px`;
      text.style.fontFamily = this.fontFamily;
      text.style.cursor = 'move';
      text.classList.add('text-element');
  
      // Atributos para armazenar dados personalizados
      text.setAttribute('data-content', content);
      text.setAttribute('data-size', size.toString());
      text.setAttribute('data-bold', this.isBold.toString());
      text.setAttribute('data-italic', this.isItalic.toString());
      text.setAttribute('data-underline', this.isUnderline.toString());
      text.setAttribute('data-font-family', this.fontFamily);
  
      // Habilitar edição do texto
      text.setAttribute('contenteditable', 'true');
  
      // Evento de clique para selecionar o texto e abrir o modal
      text.addEventListener('click', () => {
        this.selectTextElement(text);  
      });
  
      // Adicionar drag
      text.addEventListener('mousedown', (event) => this.startDrag(event, text));
  
      canvas.appendChild(text);
    }
  }

  applyChanges(): void {
    if (this.selectedElement) {
      // Aplicar as alterações no conteúdo de texto
      this.selectedElement.textContent = this.textContent;
      this.selectedElement.style.fontSize = `${this.textSize}px`;
      this.selectedElement.style.fontWeight = this.isBold ? 'bold' : 'normal';
      this.selectedElement.style.fontStyle = this.isItalic ? 'italic' : 'normal';
      this.selectedElement.style.textDecoration = this.isUnderline ? 'underline' : 'none';
      this.selectedElement.style.fontFamily = this.fontFamily;
  
      // Salvar os novos valores nos atributos personalizados
      this.selectedElement.setAttribute('data-content', this.textContent);
      this.selectedElement.setAttribute('data-size', this.textSize.toString());
      this.selectedElement.setAttribute('data-bold', this.isBold.toString());
      this.selectedElement.setAttribute('data-italic', this.isItalic.toString());
      this.selectedElement.setAttribute('data-underline', this.isUnderline.toString());
      this.selectedElement.setAttribute('data-font-family', this.fontFamily);
  
      // Habilitar edição do texto após aplicar as mudanças
      this.selectedElement.setAttribute('contenteditable', 'true');
  
      // Reaplicar o estilo para garantir que o negrito, itálico e sublinhado funcionem corretamente após as mudanças
      this.updateTextStyles();
  
      // Fechar o modal após aplicar
      this.closeModal();
    }
  }

  startDrag(event: MouseEvent, element: HTMLElement): void {
    let offsetX: number = event.clientX - element.offsetLeft;
    let offsetY: number = event.clientY - element.offsetTop;

    const onMouseMove = (moveEvent: MouseEvent) => {
      element.style.left = `${moveEvent.clientX - offsetX}px`;
      element.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  selectTextElement(element: HTMLElement): void {
    this.selectedElement = element;

    // Carregar os dados armazenados no elemento para o modal
    this.textContent = element.getAttribute('data-content') || '';
    this.textSize = parseInt(element.getAttribute('data-size') || '40', 10);
    this.isBold = element.getAttribute('data-bold') === 'true';
    this.isItalic = element.getAttribute('data-italic') === 'true';
    this.isUnderline = element.getAttribute('data-underline') === 'true';
    this.fontFamily = element.getAttribute('data-font-family') || 'Arial';

    // Abre o modal com as informações do elemento
    this.modalService.openModal('text', { content: this.textContent, size: this.textSize, isBold: this.isBold, isItalic: this.isItalic, isUnderline: this.isUnderline, fontFamily: this.fontFamily });
  }

  onBoldChange(event: Event): void {
    this.isBold = (event.target as HTMLInputElement).checked;
    this.updateTextStyles();
  }

  onItalicChange(event: Event): void {
    this.isItalic = (event.target as HTMLInputElement).checked;
    this.updateTextStyles();
  }

  onUnderlineChange(event: Event): void {
    this.isUnderline = (event.target as HTMLInputElement).checked;
    this.updateTextStyles();
  }

  onTextContentChange(newText: string): void {
    this.textContent = newText;
    this.updateTextContent(); 
  }

  onTextSizeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.textSize = Number(inputElement.value);
      this.updateTextSize();
    }
  }

  onFontFamilyChange(font: string): void {
    this.fontFamily = font;
    this.updateFontFamily();
  }

  closeModal(): void {
    if (this.selectedElement) {
      this.selectedElement.textContent = this.textContent;
      this.selectedElement.style.fontSize = `${this.textSize}px`;
      this.selectedElement.style.fontWeight = this.isBold ? 'bold' : 'normal';
      this.selectedElement.style.fontStyle = this.isItalic ? 'italic' : 'normal';
      this.selectedElement.style.textDecoration = this.isUnderline ? 'underline' : 'none';
      this.selectedElement.style.fontFamily = this.fontFamily;
  
      // Salvar no elemento os novos valores
      this.selectedElement.setAttribute('data-content', this.textContent);
      this.selectedElement.setAttribute('data-size', this.textSize.toString());
      this.selectedElement.setAttribute('data-bold', this.isBold.toString());
      this.selectedElement.setAttribute('data-italic', this.isItalic.toString());
      this.selectedElement.setAttribute('data-underline', this.isUnderline.toString());
      this.selectedElement.setAttribute('data-font-family', this.fontFamily);
  
      // Manter o elemento editável após fechar o modal
      this.selectedElement.setAttribute('contenteditable', 'true');
    }
  
    this.modalService.closeModal();
    this.showModal = false;
  }

  handleOutsideClick(event: MouseEvent): void {
    if (!this.showModal || this.selectedElement?.contains(event.target as Node)) {
      return;
    }
    this.closeModal();
  }

  getSliderBackground(): string {
    // Calculando a porcentagem baseada no tamanho do texto
    const percentage = (this.textSize - 10) / (200 - 10) * 100;
  
    // Ajustando a distribuição das cores no gradiente
    const redStop = (percentage * 0.8); // A cor vermelha ocupa 80% do valor da porcentagem
    const whiteStop = percentage; // A cor branca chega até a porcentagem calculada
    
    // Retorna um gradiente linear ajustado, mais suave
    return `linear-gradient(90deg, 
      rgb(222, 56, 56) ${redStop}%, 
      
      rgb(255, 255, 255) ${whiteStop}%)`;
  }
  

  onTextSizeChangeManual(value: string): void {
    const newSize = Number(value);
    if (!isNaN(newSize) && newSize >= 10 && newSize <= 200) {
      this.textSize = newSize;
      this.updateTextSize(); // Aplica o tamanho em tempo real
    }
  }
}
