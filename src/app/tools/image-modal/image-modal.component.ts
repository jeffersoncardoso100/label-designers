// import { Component, EventEmitter, Input, Output } from '@angular/core';

// /**
//  * Componente para exibir e manipular um modal de imagem.
//  * Permite ao usuário selecionar uma imagem, visualizar e adicionar ao canvas.
//  */
// @Component({
//   selector: 'app-image-modal',
//   templateUrl: './image-modal.component.html',
//   styleUrls: ['./image-modal.component.css']
// })
// export class ImageModalComponent {
//   /**A URL da imagem selecionada. Inicialmente, é nula até que o usuário selecione uma imagem.*/
//   @Input() public imageUrl: string | null = null; 

//   /**Emissor para comunicar mudanças na URL da imagem para o componente pai.*/
//   @Output() public imageUrlChange = new EventEmitter<string | null>(); 

//   /**  Emissor para sinalizar que a imagem foi adicionada ao canvas.*/
//   @Output() public addImageEvent = new EventEmitter<void>(); 

//   /**Emissor para sinalizar o fechamento do modal.*/
//   @Output() public closeModalEvent = new EventEmitter<void>(); 

//   /**
//    * Método acionado quando o usuário seleciona uma imagem.
//    * Lê o arquivo de imagem e emite a URL da imagem para o componente pai.
//    * 
//    * @param event - O evento de alteração do input (quando uma imagem é selecionada).
//    */
//   public onImageSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
    

//     if (input?.files?.length) {
//       const file = input.files[0];
//       const reader = new FileReader(); 

//       reader.onload = () => {
//         this.imageUrl = reader.result as string; 
//         this.imageUrlChange.emit(this.imageUrl); 
//       };
      
//       reader.readAsDataURL(file);
//     }
//   }

//   /**
//    * Método para adicionar a imagem ao canvas.
//    * Cria um elemento <img>, posiciona-o e adiciona ao canvas.
//    */
//   public addImage(): void {
//     if (this.imageUrl) {
//       const img = document.createElement('img'); 
//       img.src = this.imageUrl;
//       img.style.position = 'absolute'; 
//       img.style.top = '150px';
//       img.style.left = '150px';
//       img.style.width = '200px';

      
//       const canvas = document.getElementById('canvas');
//       if (canvas) {
//         canvas.appendChild(img); 
//       }

      
//       this.closeModal();
//     }
//   }

//   /**
//    * Método para fechar o modal.
//    * Emite um evento para o componente pai, informando que o modal deve ser fechado.
//    */
//   public closeModal(): void {
//     this.closeModalEvent.emit(); 
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  showModal: boolean = false;
  
  modalData: any = { imageUrl: null };  // Garante que sempre existe um objeto

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

  // Método para seleção de imagem
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
        const imgElement = document.createElement('img');
        imgElement.src = this.modalData.imageUrl;
  
        // Ajusta o tamanho da imagem para não ser muito grande
        imgElement.style.width = '200px';  // Defina o tamanho máximo desejado
        imgElement.style.height = 'auto';  // Mantém a proporção da imagem
  
        imgElement.style.position = 'absolute';
        imgElement.style.top = '150px';  // Ajuste conforme necessário
        imgElement.style.left = '150px';  // Ajuste conforme necessário
        imgElement.style.cursor = 'move'; // Para indicar que a imagem pode ser movida
  
        // Variáveis para controlar o movimento
        let offsetX: number = 0;
        let offsetY: number = 0;
        let isMoving = false;
  
        // Adiciona o evento de mouse para iniciar o movimento
        imgElement.addEventListener('mousedown', (event: MouseEvent) => {
          isMoving = true;
          offsetX = event.clientX - parseInt(imgElement.style.left || '0', 10);
          offsetY = event.clientY - parseInt(imgElement.style.top || '0', 10);
          imgElement.style.cursor = 'grabbing';  // Mudar o cursor durante o movimento
        });
  
        // Atualiza a posição do elemento enquanto está sendo movido
        document.addEventListener('mousemove', (event: MouseEvent) => {
          if (isMoving) {
            imgElement.style.left = `${event.clientX - offsetX}px`;
            imgElement.style.top = `${event.clientY - offsetY}px`;
          }
        });
  
        // Para o movimento quando o mouse é solto
        document.addEventListener('mouseup', () => {
          isMoving = false;
          imgElement.style.cursor = 'move';  // Restaura o cursor
        });
  
        canvas.appendChild(imgElement);  // Adiciona a imagem ao canvas
      }
      this.closeModal();  // Fecha o modal
    }
  }
}
