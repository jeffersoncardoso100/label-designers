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
  private readonly DPI = 203;
  private readonly PX_TO_DOTS = 203 / 96;
  // Offsets para corrigir desalinhamento (ajuste conforme necessário após teste)
  private readonly OFFSET_X = 0; // Em dots
  private readonly OFFSET_Y = 0; // Em dots

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
    zpl += '^PW812\n'; // Largura da etiqueta
    zpl += '^LL1218\n'; // Comprimento da etiqueta
    zpl += '^LH0,0\n'; // Origem da etiqueta

    const elements = canvas.children;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      if (element.tagName === 'DIV') {
        zpl += this.processTextElement(element, canvas);
      } else if (element.tagName === 'IMG') {
        zpl += this.processImageElement(element as HTMLImageElement, canvas);
      }
    }

    zpl += '^PQ1\n';
    zpl += '^XZ';
    return zpl;
  }

  private processTextElement(text: HTMLElement, canvas: HTMLElement): string {
    const content = text.textContent?.trim() || '';
    if (!content) return '';

    const fontSizePx = this.parseFontSize(text.style.fontSize);
    const fontSizeDots = Math.round(fontSizePx * this.PX_TO_DOTS);
    const { left, top } = this.getElementPosition(text, canvas);

    console.log(`Texto: "${content}", Posição Canvas: (${text.offsetLeft}, ${text.offsetTop}), Posição ZPL: (${left + this.OFFSET_X}, ${top + this.OFFSET_Y})`);
    return `^FO${left + this.OFFSET_X},${top + this.OFFSET_Y}^A@N,${fontSizeDots},${fontSizeDots},E:ARIAL.TTF^FD${content}^FS\n`;
  }

  private processImageElement(img: HTMLImageElement, canvas: HTMLElement): string {
    const { left, top } = this.getElementPosition(img, canvas);
    return `^FO${left + this.OFFSET_X},${top + this.OFFSET_Y}^GFA,0,0,0,\n`;
  }

  private getElementPosition(element: HTMLElement, canvas: HTMLElement): { left: number; top: number } {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Posição relativa ao canto superior esquerdo do canvas
    const leftPx = rect.left - canvasRect.left;
    const topPx = rect.top - canvasRect.top;

    return {
      left: Math.max(0, Math.round(leftPx * this.PX_TO_DOTS)),
      top: Math.max(0, Math.round(topPx * this.PX_TO_DOTS))
    };
  }

  private parseFontSize(fontSize: string): number {
    const size = parseInt(fontSize, 10);
    return isNaN(size) ? 10 : size; // Default 10px
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