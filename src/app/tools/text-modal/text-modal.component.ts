import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';
import { TextStyleService } from '../../services/text-style.service';
import { CommonModule } from '@angular/common';
import { DeleteService } from '../../services/delete.service';

@Component({
  selector: 'app-text-modal',
  standalone: true,
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
  fontFamily: string = 'Arial';
  fontList: string[] = ['Arial', 'Verdana', 'Courier New', 'Georgia', 'Times New Roman', 'Tahoma'];

  selectedElement: HTMLElement | null = null;

  @Output() textContentChange = new EventEmitter<string>();
  @Output() textSizeChange = new EventEmitter<number>();
  

  constructor(
    private modalService: ModalService,
    public textStyleService: TextStyleService,
    private deleteService: DeleteService
    
  ) {}

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

    document.addEventListener('dblclick', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('text-element')) {
        this.selectTextElement(target);
        target.setAttribute('contenteditable', 'true');
      }
    });
  }

  updateTextContent(): void {
    if (this.selectedElement) {
      this.selectedElement.textContent = this.textContent;
      this.selectedElement.setAttribute('data-content', this.textContent);
    }
  }

  updateTextSize(): void {
    if (this.selectedElement) {
      this.selectedElement.style.fontSize = `${this.textSize}px`;
      this.selectedElement.setAttribute('data-size', this.textSize.toString());
    }
  }

  updateFontFamily(): void {
    if (this.selectedElement) {
      this.selectedElement.style.fontFamily = this.fontFamily;
      this.selectedElement.setAttribute('data-font-family', this.fontFamily);
    }
  }

  updateTextStyles(): void {
    if (this.selectedElement) {
      this.selectedElement.style.fontWeight = this.isBold ? 'bold' : 'normal';
      this.selectedElement.style.fontStyle = this.isItalic ? 'italic' : 'normal';
      this.selectedElement.style.textDecoration = this.isUnderline ? 'underline' : 'none';

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

      text.setAttribute('data-content', content);
      text.setAttribute('data-size', size.toString());
      text.setAttribute('data-bold', this.isBold.toString());
      text.setAttribute('data-italic', this.isItalic.toString());
      text.setAttribute('data-underline', this.isUnderline.toString());
      text.setAttribute('data-font-family', this.fontFamily);

      text.setAttribute('contenteditable', 'true');

      text.addEventListener('click', () => {
        this.selectTextElement(text);
      });

      text.addEventListener('mousedown', (event) => this.startDrag(event, text));

      canvas.appendChild(text);
    }
  }

  applyChanges(): void {
    if (this.selectedElement) {
      this.selectedElement.textContent = this.textContent;
      this.selectedElement.style.fontSize = `${this.textSize}px`;
      this.selectedElement.style.fontWeight = this.isBold ? 'bold' : 'normal';
      this.selectedElement.style.fontStyle = this.isItalic ? 'italic' : 'normal';
      this.selectedElement.style.textDecoration = this.isUnderline ? 'underline' : 'none';
      this.selectedElement.style.fontFamily = this.fontFamily;

      this.selectedElement.setAttribute('data-content', this.textContent);
      this.selectedElement.setAttribute('data-size', this.textSize.toString());
      this.selectedElement.setAttribute('data-bold', this.isBold.toString());
      this.selectedElement.setAttribute('data-italic', this.isItalic.toString());
      this.selectedElement.setAttribute('data-underline', this.isUnderline.toString());
      this.selectedElement.setAttribute('data-font-family', this.fontFamily);

      this.selectedElement.setAttribute('contenteditable', 'true');
      this.updateTextStyles();
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
    this.textContent = element.getAttribute('data-content') || '';
    this.textSize = parseInt(element.getAttribute('data-size') || '40', 10);
    this.isBold = element.getAttribute('data-bold') === 'true';
    this.isItalic = element.getAttribute('data-italic') === 'true';
    this.isUnderline = element.getAttribute('data-underline') === 'true';
    this.fontFamily = element.getAttribute('data-font-family') || 'Arial';

    this.modalService.openModal('text', {
      content: this.textContent,
      size: this.textSize,
      isBold: this.isBold,
      isItalic: this.isItalic,
      isUnderline: this.isUnderline,
      fontFamily: this.fontFamily
    });
  }

// Função de deleção usando o serviço
deleteSelectedElement(): void {
  if (this.deleteService.deleteElement(this.selectedElement)) {
    this.selectedElement = null;
    this.closeModal();
  }
}

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent): void {
  if (this.showModal && event.key === 'Delete' && this.selectedElement) {
    this.deleteSelectedElement();
  }
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

      this.selectedElement.setAttribute('data-content', this.textContent);
      this.selectedElement.setAttribute('data-size', this.textSize.toString());
      this.selectedElement.setAttribute('data-bold', this.isBold.toString());
      this.selectedElement.setAttribute('data-italic', this.isItalic.toString());
      this.selectedElement.setAttribute('data-underline', this.isUnderline.toString());
      this.selectedElement.setAttribute('data-font-family', this.fontFamily);

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
    const percentage = ((this.textSize - 10) / (200 - 10)) * 100;
    const redStop = percentage * 0.8;
    const whiteStop = percentage;
    return `linear-gradient(90deg, rgb(222, 56, 56) ${redStop}%, rgb(255, 255, 255) ${whiteStop}%)`;
  }

  onTextSizeChangeManual(value: string): void {
    const newSize = Number(value);
    if (!isNaN(newSize) && newSize >= 10 && newSize <= 200) {
      this.textSize = newSize;
      this.updateTextSize();
    }
  }
}