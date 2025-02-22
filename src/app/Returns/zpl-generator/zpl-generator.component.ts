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
    let zpl = '^XA\n';

    const textElements = canvas.querySelectorAll('div:not(.shape-element)') as NodeListOf<HTMLDivElement>;
    const imageElements = canvas.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    const shapeElements = canvas.querySelectorAll('.shape-element') as NodeListOf<HTMLElement>;

    zpl += this.processTextElements(textElements, canvas);
    zpl += this.processImageElements(imageElements, canvas);
    zpl += this.processShapeElements(shapeElements, canvas);

    zpl += '^XZ';
    return zpl;
  }

  private processTextElements(textElements: NodeListOf<HTMLDivElement>, canvas: HTMLElement): string {
    let zpl = '';
    textElements.forEach((text) => {
      const content = text.textContent?.trim() || '';
      if (!content) return;
      const fontSize = this.parseFontSize(text.style.fontSize);
      const { left, top } = this.getElementPosition(text, canvas);

      zpl += `^FO${left},${top}^A0N,${fontSize},${fontSize}^FD${content}^FS\n`;
    });
    return zpl;
  }

  private processImageElements(imageElements: NodeListOf<HTMLImageElement>, canvas: HTMLElement): string {
    let zpl = '';
    imageElements.forEach((img) => {
      const { left, top } = this.getElementPosition(img, canvas);
      const width = Math.round(parseFloat(img.style.width) || img.width);
      const height = Math.round(parseFloat(img.style.height) || img.height);
      zpl += `^FO${left},${top}^GFA,${width * height},${width * height},${Math.ceil(width / 8)},${this.imageToZPL(img)}^FS\n`;
    });
    return zpl;
  }

  private processShapeElements(shapeElements: NodeListOf<HTMLElement>, canvas: HTMLElement): string {
    let zpl = '';
    shapeElements.forEach((shape) => {
      const { left, top } = this.getElementPosition(shape, canvas);
      const width = Math.round(parseFloat(shape.style.width) || 100);
      const height = Math.round(parseFloat(shape.style.height) || 100);
      const borderWidth = parseInt(shape.style.borderWidth, 10) || 1;
      const borderColor = shape.style.borderColor || '#000000';
      const fillColor = shape.style.backgroundColor || 'transparent';

      const shapeType = shape.getAttribute('data-type') || 'square';

      switch (shapeType) {
        case 'square':
        case 'rectangle':
          zpl += `^FO${left},${top}^GB${width},${height},${borderWidth},${this.getZPLColor(borderColor)},0^FS\n`;
          if (fillColor !== 'transparent') {
            zpl += `^FO${left},${top}^GB${width},${height},0,${this.getZPLColor(fillColor)},0^FS\n`;
          }
          break;
        case 'circle':
          const diameter = Math.min(width, height);
          zpl += `^FO${left},${top}^GC${diameter},${borderWidth},${this.getZPLColor(borderColor)}^FS\n`;
          break;
        case 'triangle':
          zpl += `^FO${left},${top}^GB${width},${height},${borderWidth},${this.getZPLColor(borderColor)},0^FS\n`;
          break;
        default:
          console.warn(`Forma não suportada: ${shapeType}`);
      }
    });
    return zpl;
  }

  private imageToZPL(img: HTMLImageElement): string {
    return '::'; // Placeholder - implement actual image conversion logic here
  }

  private getZPLColor(cssColor: string): string {
    const color = cssColor.toLowerCase();
    return color === '#000000' || color === 'black' || color === 'rgb(0,0,0)' ? 'B' : 'W';
  }

  private getElementPosition(element: HTMLElement, canvas: HTMLElement): { left: number; top: number } {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    return {
      left: Math.round(rect.left - canvasRect.left),
      top: Math.round(rect.top - canvasRect.top),
    };
  }

  private parseFontSize(fontSize: string): number {
    return parseInt(fontSize, 10) || 10;
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