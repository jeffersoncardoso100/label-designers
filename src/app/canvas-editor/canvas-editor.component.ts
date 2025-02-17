// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common'; 
// import { FormsModule } from '@angular/forms';
// import html2canvas from 'html2canvas';
// import { TextModalComponent } from '../tools/text-modal/text-modal.component';
// import { ImageModalComponent } from "../tools/image-modal/image-modal.component";
// import { ZplGeneratorComponent } from "../Returns/zpl-generator/zpl-generator.component";
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { PngGeneratorComponent } from "../Returns/png-generator/png-generator.component";
// @Component({
//   selector: 'app-canvas-editor',
//   standalone: true, 
//   imports: [CommonModule, FormsModule, TextModalComponent, ImageModalComponent, ZplGeneratorComponent, MatButtonModule,
//     MatIconModule, PngGeneratorComponent], 
//   templateUrl: './canvas-editor.component.html',
//   styleUrls: ['./canvas-editor.component.css']
// })
// export class CanvasEditorComponent {
//   textContent: string = '';
//   textSize: number = 10;
//   textTop: number = 100;
//   textLeft: number = 100;

//   imageUrl: string | null = null;
//   zpl: string = '';
//   /**Modal de texto */
//   showTextModal: boolean = false;
//   /**Modal de imagem*/
//   showImageModal: boolean = false;
//   zplGenerator: any;
// zplContent: any;

//   openTextModal(): void {
//     this.showTextModal = true;
//   }

//   closeTextModal(): void {
//     this.showTextModal = false;
//   }

//   addText(): void {
//     const canvas = document.getElementById('canvas');
//     if (canvas) {
//       const text = document.createElement('div');
//       text.textContent = this.textContent || 'Novo texto!';
//       text.contentEditable = 'true';
//       text.style.position = 'absolute';
//       text.style.top = `${this.textTop}px`;
//       text.style.left = `${this.textLeft}px`;
//       text.style.fontSize = `${this.textSize}px`;
//       text.style.cursor = 'move';

//       text.addEventListener('mousedown', (event) => this.startDrag(event, text));

//       canvas.appendChild(text);
//       this.closeTextModal();
//     }
//   }

//   startDrag(event: MouseEvent, text: HTMLElement): void {
//     const offsetX = event.clientX - text.getBoundingClientRect().left;
//     const offsetY = event.clientY - text.getBoundingClientRect().top;

//     const onMouseMove = (moveEvent: MouseEvent) => {
//       text.style.left = `${moveEvent.clientX - offsetX}px`;
//       text.style.top = `${moveEvent.clientY - offsetY}px`;
//     };

//     const onMouseUp = () => {
//       document.removeEventListener('mousemove', onMouseMove);
//       document.removeEventListener('mouseup', onMouseUp);
//     };

//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//   }

//   updateTextContent(newText: string): void {
//     this.textContent = newText;
//   }

//   updateTextSize(newSize: number): void {
//     this.textSize = newSize;
//   }

//   openImageModal(): void {
 
//     this.showImageModal = true
//   }

//   closeImageModal(): void {
  
//     this.showImageModal = false
//   }

//   generateZPL(): void {
//     if (this.zplGenerator) {
//       this.zplGenerator.generateZPL();
//     }
//   }
//   onImageSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input?.files?.length) {
//       const file = input.files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imageUrl = reader.result as string;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   addImage(): void {
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
//     }
//   }

 
// }
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service'; // Serviço para gerenciar o estado dos modais
import { ImageModalComponent } from "../tools/image-modal/image-modal.component";
import { TextModalComponent } from "../tools/text-modal/text-modal.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ZplGeneratorComponent } from "../Returns/zpl-generator/zpl-generator.component";
import { PngGeneratorComponent } from "../Returns/png-generator/png-generator.component";
import { BmpGeneratorComponent } from '../Returns/bmp-generator/bmp-generator.component';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.css'],
  imports: [ImageModalComponent, TextModalComponent,
     CommonModule, SidebarComponent, ZplGeneratorComponent,
      PngGeneratorComponent,BmpGeneratorComponent]
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
  addImage(imageUrl: string): void {
    const canvas = document.getElementById('canvas');
    if (canvas && imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.position = 'absolute';
      img.style.top = '150px';
      img.style.left = '150px';
      img.style.width = '200px';

      canvas.appendChild(img);
    }
  }
  toggleSize(event: MouseEvent) {
    const element = event.target as HTMLElement;
    element.classList.toggle('expanded'); // Alterna a classe 'expanded' ao clicar
  }
}

