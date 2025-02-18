import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-modal',
  imports: [FormsModule],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  showModal: boolean = false;
  imageSize: number = 100;
  modalData: any = { imageUrl: null };  // Garante que sempre existe um objeto
  isMoving: boolean = false; // Controle de movimentação
  offsetX: number = 0; // Posições de offset
  offsetY: number = 0;
  imgElement: HTMLImageElement | null = null;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'image' && state.open) {
        this.modalData = state.data;
        this.showModal = true;
      } else if (state.modalType === 'image' && !state.open) {
        this.showModal = false;
      }
    });
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (!this.modalData) {
          this.modalData = { imageUrl: null }; // Garante que modalData existe
        }
        this.modalData.imageUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  addImage(): void {
    if (this.modalData.imageUrl) {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        this.imgElement = document.createElement('img');
        this.imgElement.src = this.modalData.imageUrl;

        // Ajusta o tamanho da imagem com base no valor do slider
        this.imgElement.style.width = `${this.imageSize}px`;
        this.imgElement.style.height = 'auto';  // Mantém a proporção da imagem

        this.imgElement.style.position = 'absolute';
        this.imgElement.style.top = '150px';  // Ajuste conforme necessário
        this.imgElement.style.left = '150px';  // Ajuste conforme necessário
        this.imgElement.style.cursor = 'move'; // Para indicar que a imagem pode ser movida

        // Adiciona o evento de mouse para iniciar o movimento
        this.imgElement.addEventListener('mousedown', (event: MouseEvent) => {
          this.isMoving = true;
          this.offsetX = event.clientX - parseInt(this.imgElement!.style.left || '0', 10);
          this.offsetY = event.clientY - parseInt(this.imgElement!.style.top || '0', 10);
          this.imgElement!.style.cursor = 'grabbing';  // Mudar o cursor durante o movimento
        });

        // Atualiza a posição do elemento enquanto está sendo movido
        document.addEventListener('mousemove', (event: MouseEvent) => {
          if (this.isMoving && this.imgElement) {
            this.imgElement.style.left = `${event.clientX - this.offsetX}px`;
            this.imgElement.style.top = `${event.clientY - this.offsetY}px`;
          }
        });

        // Para o movimento quando o mouse é solto
        document.addEventListener('mouseup', () => {
          this.isMoving = false;
          this.imgElement!.style.cursor = 'move';  // Restaura o cursor
        });

        canvas.appendChild(this.imgElement);  // Adiciona a imagem ao canvas
      }
      this.closeModal();  // Fecha o modal
    }
  }
  getSliderBackground(): string {
    // Calculando a porcentagem baseada no tamanho da imagem
    const percentage = (this.imageSize - 50) / (500 - 50) * 100;
  
    // Ajustando a distribuição das cores no gradiente
    const redStop = percentage * 0.8;  // A cor vermelha ocupa 80% do valor da porcentagem
    const whiteStop = percentage;  // A cor branca chega até a porcentagem calculada
  
    // Retorna o gradiente linear ajustado
    return `linear-gradient(90deg, rgb(222, 56, 56) ${redStop}%, rgb(255, 255, 255) ${whiteStop}%)`;
  }
  
}
