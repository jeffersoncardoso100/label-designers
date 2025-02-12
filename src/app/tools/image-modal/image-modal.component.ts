import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente para exibir e manipular um modal de imagem.
 * Permite ao usuário selecionar uma imagem, visualizar e adicionar ao canvas.
 */
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  /**A URL da imagem selecionada. Inicialmente, é nula até que o usuário selecione uma imagem.*/
  @Input() public imageUrl: string | null = null; 

  /**Emissor para comunicar mudanças na URL da imagem para o componente pai.*/
  @Output() public imageUrlChange = new EventEmitter<string | null>(); 

  /**  Emissor para sinalizar que a imagem foi adicionada ao canvas.*/
  @Output() public addImageEvent = new EventEmitter<void>(); 

  /**Emissor para sinalizar o fechamento do modal.*/
  @Output() public closeModalEvent = new EventEmitter<void>(); 

  /**
   * Método acionado quando o usuário seleciona uma imagem.
   * Lê o arquivo de imagem e emite a URL da imagem para o componente pai.
   * 
   * @param event - O evento de alteração do input (quando uma imagem é selecionada).
   */
  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    

    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader(); 

      reader.onload = () => {
        this.imageUrl = reader.result as string; 
        this.imageUrlChange.emit(this.imageUrl); 
      };
      
      reader.readAsDataURL(file);
    }
  }

  /**
   * Método para adicionar a imagem ao canvas.
   * Cria um elemento <img>, posiciona-o e adiciona ao canvas.
   */
  public addImage(): void {
    if (this.imageUrl) {
      const img = document.createElement('img'); 
      img.src = this.imageUrl;
      img.style.position = 'absolute'; 
      img.style.top = '150px';
      img.style.left = '150px';
      img.style.width = '200px';

      
      const canvas = document.getElementById('canvas');
      if (canvas) {
        canvas.appendChild(img); 
      }

      
      this.closeModal();
    }
  }

  /**
   * Método para fechar o modal.
   * Emite um evento para o componente pai, informando que o modal deve ser fechado.
   */
  public closeModal(): void {
    this.closeModalEvent.emit(); 
  }
}
