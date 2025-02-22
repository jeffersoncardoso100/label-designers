import { AfterViewInit, Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-bmp-generator',
  templateUrl: './bmp-generator.component.html',
  styleUrl: './bmp-generator.component.css'
})
export class BmpGeneratorComponent implements AfterViewInit {
  showModal = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'bmp' && state.open) {
        this.showModal = true;
        setTimeout(() => this.generateBMP(), 200);
      } else {
        this.showModal = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupCanvas();
  }

  setupCanvas(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = 800; // Dimensões fixas
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white'; // Fundo branco
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Teste BMP', 50, 50);
      }
    }
  }

  generateBMP(): void {
    const contentElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (!contentElement) {
      console.error('Canvas não encontrado!');
      return;
    }

    html2canvas(contentElement, { scale: 2 }).then((canvas) => {
      const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const bmpData = this.createBMP(imageData);
        this.downloadBMP(bmpData);
      } else {
        console.error('Erro ao capturar a imagem do canvas.');
      }
    });
  }

  createBMP(imageData: ImageData): Uint8Array {
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;

    const rowPadding = (4 - ((width * 3) % 4)) % 4;
    const dataSize = (width * 3 + rowPadding) * height;
    const fileSize = 54 + dataSize;

    const buffer = new ArrayBuffer(fileSize);
    const data = new DataView(buffer);

    let offset = 0;
    data.setUint8(offset++, 0x42);
    data.setUint8(offset++, 0x4D);
    data.setUint32(offset, fileSize, true); offset += 4;
    data.setUint32(offset, 0, true); offset += 4;
    data.setUint32(offset, 54, true); offset += 4;
    data.setUint32(offset, 40, true); offset += 4;
    data.setInt32(offset, width, true); offset += 4;
    data.setInt32(offset, -height, true); offset += 4;
    data.setUint16(offset, 1, true); offset += 2;
    data.setUint16(offset, 24, true); offset += 2;
    data.setUint32(offset, 0, true); offset += 4;
    data.setUint32(offset, dataSize, true); offset += 4;
    data.setInt32(offset, 0, true); offset += 4;
    data.setInt32(offset, 0, true); offset += 4;
    data.setUint32(offset, 0, true); offset += 4;
    data.setUint32(offset, 0, true); offset += 4;

    let dataOffset = 54;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        data.setUint8(dataOffset++, b);
        data.setUint8(dataOffset++, g);
        data.setUint8(dataOffset++, r);
      }
      for (let p = 0; p < rowPadding; p++) {
        data.setUint8(dataOffset++, 0);
      }
    }

    return new Uint8Array(buffer);
  }

  downloadBMP(bmpData: Uint8Array): void {
    const blob = new Blob([bmpData], { type: 'image/bmp' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas_image.bmp';
    a.click();
    URL.revokeObjectURL(url);
  }
}