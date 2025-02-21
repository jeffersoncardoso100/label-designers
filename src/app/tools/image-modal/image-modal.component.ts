import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  showModal: boolean = false;
  imageSize: number = 100; // Valor inicial padrão
  modalData: any = { imageUrl: null };
  selectedImageElement: HTMLImageElement | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'image') {
        if (state.open) {
          this.modalData = state.data || { imageUrl: null, size: 100 };
          // Só atualiza imageSize se não houver um elemento selecionado
          if (!this.selectedImageElement) {
            this.imageSize = this.modalData.size || 100;
          }
          this.showModal = true;
        } else {
          this.showModal = false;
        }
      }
    });

    document.addEventListener('dblclick', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG' && target.parentElement?.id === 'canvas') {
        this.selectImageElement(target as HTMLImageElement);
        event.stopPropagation();
      }
    });
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.showModal = false;
    this.selectedImageElement = null; // Limpa a seleção, mas mantém imageSize
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.modalData.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addImage(): void {
    if (this.modalData.imageUrl) {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        const imgElement = document.createElement('img');
        imgElement.src = this.modalData.imageUrl;
        imgElement.style.width = `${this.imageSize}px`;
        imgElement.style.height = 'auto';
        imgElement.style.position = 'absolute';
        imgElement.style.top = '150px';
        imgElement.style.left = '150px';
        imgElement.style.cursor = 'move';
        imgElement.classList.add('image-element');

        imgElement.setAttribute('data-size', this.imageSize.toString());
        imgElement.setAttribute('data-top', '150');
        imgElement.setAttribute('data-left', '150');

        this.enableDrag(imgElement);
        imgElement.addEventListener('dblclick', () => {
          this.selectImageElement(imgElement);
        });

        canvas.appendChild(imgElement);
        this.closeModal();
      }
    }
  }

  selectImageElement(element: HTMLImageElement): void {
    this.selectedImageElement = element;

    // Carrega o tamanho salvo do elemento
    const savedSize = element.getAttribute('data-size');
    if (savedSize) {
      this.imageSize = parseInt(savedSize, 10);
    } else {
      // Fallback para o estilo atual, se data-size não existir
      this.imageSize = parseInt(element.style.width || '100', 10);
      element.setAttribute('data-size', this.imageSize.toString()); // Garante que data-size seja inicializado
    }

    const currentTop = element.getAttribute('data-top') || element.style.top || '150';
    const currentLeft = element.getAttribute('data-left') || element.style.left || '150';

    this.modalData.imageUrl = element.src;
    this.modalService.openModal('image', {
      imageUrl: this.modalData.imageUrl,
      size: this.imageSize,
      top: parseInt(currentTop, 10),
      left: parseInt(currentLeft, 10)
    });
  }

  updateImageSize(): void {
    if (this.selectedImageElement) {
      this.selectedImageElement.style.width = `${this.imageSize}px`;
      this.selectedImageElement.style.height = 'auto';
      this.selectedImageElement.setAttribute('data-size', this.imageSize.toString());
    }
  }

  applyChanges(): void {
    if (this.selectedImageElement) {
      this.selectedImageElement.style.width = `${this.imageSize}px`;
      this.selectedImageElement.style.height = 'auto';
      this.selectedImageElement.setAttribute('data-size', this.imageSize.toString());

      const currentTop = this.selectedImageElement.style.top || '150px';
      const currentLeft = this.selectedImageElement.style.left || '150px';
      this.selectedImageElement.setAttribute('data-top', currentTop.replace('px', ''));
      this.selectedImageElement.setAttribute('data-left', currentLeft.replace('px', ''));

      this.closeModal();
    }
  }

  onSliderChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.imageSize = Number(inputElement.value);
      this.updateImageSize();
    }
  }

  getSliderBackground(): string {
    const percentage = ((this.imageSize - 50) / (500 - 50)) * 100;
    const redStop = percentage * 0.8;
    const whiteStop = percentage;
    return `linear-gradient(90deg, rgb(222, 56, 56) ${redStop}%, rgb(255, 255, 255) ${whiteStop}%)`;
  }

  private enableDrag(element: HTMLElement): void {
    let offsetX: number;
    let offsetY: number;
    let isDragging = false;

    element.addEventListener('mousedown', (event: MouseEvent) => {
      isDragging = true;
      offsetX = event.clientX - parseInt(element.style.left || '0', 10);
      offsetY = event.clientY - parseInt(element.style.top || '0', 10);
      element.style.cursor = 'grabbing';
      event.preventDefault();
    });

    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (isDragging) {
        const newLeft = event.clientX - offsetX;
        const newTop = event.clientY - offsetY;
        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
        element.setAttribute('data-left', newLeft.toString());
        element.setAttribute('data-top', newTop.toString());
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.cursor = 'move';
    });
  }
}