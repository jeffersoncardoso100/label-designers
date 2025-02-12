import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { TextModalComponent } from '../tools/text-modal/text-modal.component';
import { ImageModalComponent } from "../tools/image-modal/image-modal.component";
import { ZplGeneratorComponent } from "../Returns/zpl-generator/zpl-generator.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PngGeneratorComponent } from "../Returns/png-generator/png-generator.component";
@Component({
  selector: 'app-canvas-editor',
  standalone: true, 
  imports: [CommonModule, FormsModule, TextModalComponent, ImageModalComponent, ZplGeneratorComponent, MatButtonModule,
    MatIconModule, PngGeneratorComponent], 
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.css']
})
export class CanvasEditorComponent {
  textContent: string = '';
  textSize: number = 10;
  textTop: number = 100;
  textLeft: number = 100;

  imageUrl: string | null = null;
  zpl: string = '';
  /**Modal de texto */
  showTextModal: boolean = false;
  /**Modal de imagem*/
  showImageModal: boolean = false;
  zplGenerator: any;
zplContent: any;

  openTextModal(): void {
    this.showTextModal = true;
  }

  closeTextModal(): void {
    this.showTextModal = false;
  }

  addText(): void {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const text = document.createElement('div');
      text.textContent = this.textContent || 'Novo texto!';
      text.contentEditable = 'true';
      text.style.position = 'absolute';
      text.style.top = `${this.textTop}px`;
      text.style.left = `${this.textLeft}px`;
      text.style.fontSize = `${this.textSize}px`;
      text.style.cursor = 'move';

      text.addEventListener('mousedown', (event) => this.startDrag(event, text));

      canvas.appendChild(text);
      this.closeTextModal();
    }
  }

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

  updateTextContent(newText: string): void {
    this.textContent = newText;
  }

  updateTextSize(newSize: number): void {
    this.textSize = newSize;
  }

  openImageModal(): void {
 
    this.showImageModal = true
  }

  closeImageModal(): void {
  
    this.showImageModal = false
  }

  generateZPL(): void {
    if (this.zplGenerator) {
      this.zplGenerator.generateZPL();
    }
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addImage(): void {
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
    }
  }

  generatePNG(): void {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      html2canvas(canvas).then((canvasElement) => {
        const imgURL = canvasElement.toDataURL('image/png');
        this.downloadImage(imgURL);
      });
    }
  }

  downloadImage(imageUrl: string): void {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'canvas_image.png';
    a.click();
  }
}



