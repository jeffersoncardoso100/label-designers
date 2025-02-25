import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-zpl-generator',
  templateUrl: './zpl-generator.component.html',
  styleUrls: ['./zpl-generator.component.css']
})
export class ZplGeneratorComponent implements OnInit {
  public zpl: string = '';
  public showModal: boolean = false;
  private readonly DPI = 203; // 203 DPI fixo como especificado
  private readonly PX_TO_DOTS = this.DPI / 96; // Conversão de pixels (96 DPI web) para dots (203 DPI)

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      this.showModal = state.modalType === 'zpl' && state.open;
      if (this.showModal) {
        this.generateZPL();
      }
    });
  }

  public generateZPL(): void {
    const canvas = document.getElementById('canvas') as HTMLElement | null;
    if (!canvas) {
      console.error('Canvas não encontrado!');
      return;
    }
    this.zpl = this.buildZPL(canvas);
    console.log('Código ZPL gerado:', this.zpl);
  }

  private buildZPL(canvas: HTMLElement): string {
    let zpl = '^XA\n'; // Início do label
    zpl += '^PW812\n'; // Largura de 4 polegadas em 203 DPI (4 * 203 = 812 dots)
    zpl += '^LL1218\n'; // Comprimento de 6 polegadas em 203 DPI (6 * 203 = 1218 dots)
    zpl += '^LH0,0\n'; // Origem do label

    const textElements = canvas.querySelectorAll('div:not(.shape-element)') as NodeListOf<HTMLDivElement>;
    const imageElements = canvas.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    const shapeElements = canvas.querySelectorAll('.shape-element') as NodeListOf<HTMLElement>;

    zpl += this.processTextElements(textElements, canvas);
    zpl += this.processImageElements(imageElements, canvas);
    zpl += this.processShapeElements(shapeElements, canvas);

    zpl += '^PQ1\n'; // 1 cópia
    zpl += '^XZ'; // Fim do label
    return zpl;
  }

  private processTextElements(textElements: NodeListOf<HTMLDivElement>, canvas: HTMLElement): string {
    let zpl = '';
    textElements.forEach((text) => {
      const content = text.textContent?.trim() || '';
      if (!content) return;

      const fontSizePx = this.parseFontSize(text.style.fontSize);
      const fontSizeDots = Math.round(fontSizePx * this.PX_TO_DOTS); // Converte para 203 DPI
      const { left, top } = this.getElementPosition(text, canvas);

      zpl += `^FO${left},${top}^A0N,${fontSizeDots},${fontSizeDots}^FD${content}^FS\n`;
    });
    return zpl;
  }

  private processImageElements(imageElements: NodeListOf<HTMLImageElement>, canvas: HTMLElement): string {
    let zpl = '';
    imageElements.forEach((img) => {
      const { left, top } = this.getElementPosition(img, canvas);
      const widthPx = parseFloat(img.style.width) || img.width || 50;
      const heightPx = parseFloat(img.style.height) || img.height || 50;
      const widthDots = Math.round(widthPx * this.PX_TO_DOTS);
      const heightDots = Math.round(heightPx * this.PX_TO_DOTS);
      const byteWidth = Math.ceil(widthDots / 8); // Bytes por linha
      const totalBytes = byteWidth * heightDots;

      const imageData = this.imageToZPL(img, widthDots, heightDots);
      zpl += `^FO${left},${top}^GFA,${totalBytes},${totalBytes},${byteWidth},${imageData}^FS\n`;
    });
    return zpl;
  }

  private processShapeElements(shapeElements: NodeListOf<HTMLElement>, canvas: HTMLElement): string {
    let zpl = '';
    shapeElements.forEach((shape) => {
      const { left, top } = this.getElementPosition(shape, canvas);
      const widthPx = parseFloat(shape.style.width) || 100;
      const heightPx = parseFloat(shape.style.height) || 100;
      const widthDots = Math.round(widthPx * this.PX_TO_DOTS);
      const heightDots = Math.round(heightPx * this.PX_TO_DOTS);
      const borderWidthPx = parseInt(shape.style.borderWidth, 10) || 1;
      const borderWidthDots = Math.round(borderWidthPx * this.PX_TO_DOTS);
      const borderColor = this.getZPLColor(shape.style.borderColor);

      const shapeType = shape.getAttribute('data-type') || 'square';

      switch (shapeType) {
        case 'square':
        case 'rectangle':
          zpl += `^FO${left},${top}^GB${widthDots},${heightDots},${borderWidthDots},${borderColor}^FS\n`;
          break;
        case 'circle':
          const diameterDots = Math.min(widthDots, heightDots);
          zpl += `^FO${left},${top}^GC${diameterDots},${borderWidthDots},${borderColor}^FS\n`;
          break;
        case 'triangle':
          // Triângulo não é nativo no ZPL, usando retângulo como aproximação
          zpl += `^FO${left},${top}^GB${widthDots},${heightDots},${borderWidthDots},${borderColor}^FS\n`;
          break;
        default:
          console.warn(`Forma não suportada: ${shapeType}`);
      }
    });
    return zpl;
  }

  private imageToZPL(img: HTMLImageElement, widthDots: number, heightDots: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '00'; // Retorna byte padrão se falhar

    canvas.width = widthDots;
    canvas.height = heightDots;
    ctx.drawImage(img, 0, 0, widthDots, heightDots);

    const imageData = ctx.getImageData(0, 0, widthDots, heightDots);
    const data = imageData.data;
    let binary = '';
    let hexString = '';

    for (let y = 0; y < heightDots; y++) {
      for (let x = 0; x < widthDots; x++) {
        const i = (y * widthDots + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const bit = (r * 0.299 + g * 0.587 + b * 0.114) > 127 ? '0' : '1'; // Monocromático
        binary += bit;

        if (binary.length === 8) {
          hexString += parseInt(binary, 2).toString(16).toUpperCase().padStart(2, '0');
          binary = '';
        }
      }
      if (binary.length > 0) {
        binary = binary.padEnd(8, '0');
        hexString += parseInt(binary, 2).toString(16).toUpperCase().padStart(2, '0');
        binary = '';
      }
    }

    return hexString || '00';
  }

  private getZPLColor(cssColor: string): string {
    if (!cssColor || cssColor === 'transparent') return 'B'; // Preto padrão
    const color = cssColor.toLowerCase();
    return (color === '#ffffff' || color === 'white' || color === 'rgb(255,255,255)') ? 'W' : 'B';
  }

  private getElementPosition(element: HTMLElement, canvas: HTMLElement): { left: number; top: number } {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const leftPx = rect.left - canvasRect.left;
    const topPx = rect.top - canvasRect.top;
    return {
      left: Math.max(0, Math.round(leftPx * this.PX_TO_DOTS)), // Evita posições negativas
      top: Math.max(0, Math.round(topPx * this.PX_TO_DOTS))
    };
  }

  private parseFontSize(fontSize: string): number {
    return parseInt(fontSize, 10) || 10; // Default 10px
  }

  public copyZPL(): void {
    navigator.clipboard.writeText(this.zpl)
      .then(() => alert('Código ZPL copiado com sucesso!'))
      .catch(err => console.error('Erro ao copiar ZPL', err));
  }
  

  public closeModal(): void {
    this.modalService.closeModal();
  }
}