import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-canvas-editor',
  imports: [FormsModule],
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.css']
})
export class CanvasEditorComponent {
  textContent: string = '';
  textSize: number = 16;
  textTop: number = 100;
  textLeft: number = 100;

  imageUrl: string | null = null;
  zpl: string = '';

  openTextModal(): void {
    const modalText = document.getElementById('text-modal');
    if (modalText) {
      modalText.style.display = 'block';
    }
  }

  closeTextModal(): void {
    const modalText = document.getElementById('text-modal');
    if (modalText) {
      modalText.style.display = 'none';
    }
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
    const modalImage = document.getElementById('image-modal');
    if (modalImage) {
      modalImage.style.display = 'block';
    }
  }

  closeImageModal(): void {
    const modalImage = document.getElementById('image-modal');
    if (modalImage) {
      modalImage.style.display = 'none';
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

  generateZPL(): void {
    console.log('iniciando')
    let zpl = '^XA\n';  // Início do código ZPL

    // Adicionar texto
    const canvas = document.getElementById('canvas');
    if (canvas) {
      // Captura todos os elementos de texto (div) dentro do canvas
      const textElements = canvas.querySelectorAll('div');
      textElements.forEach((text: HTMLElement) => {
        const content = text.textContent || '';
        const fontSize = parseInt(text.style.fontSize, 10);

        // Calcula as coordenadas relativas ao canvas
        const rect = text.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const top = Math.round(rect.top - canvasRect.top);
        const left = Math.round(rect.left - canvasRect.left);

        // Adiciona o comando ZPL para o texto
        zpl += `^FO${left},${top}^A0N,${fontSize},${fontSize}^FD${content}^FS\n`;
      });

      // Captura todos os elementos de imagem (img) dentro do canvas
      const imageElements = canvas.querySelectorAll('img');
      imageElements.forEach((img: HTMLImageElement) => {
        const rect = img.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const top = Math.round(rect.top - canvasRect.top);
        const left = Math.round(rect.left - canvasRect.left);

        // Adiciona o comando ZPL para a imagem (exemplo básico)
        zpl += `^FO${left},${top}^GFA,100,100,10,${img.src}^FS\n`;
      });
    }

    zpl += '^XZ';  // Fim do código ZPL
    this.zpl = zpl;  // Atualiza a variável zpl para exibir no textarea

    console.log('Código ZPL gerado:', this.zpl);  // Exibe o ZPL no console para depuração
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