import { Component } from '@angular/core';

@Component({
  selector: 'app-zpl-generator',
  templateUrl: './zpl-generator.component.html',
  styleUrls: ['./zpl-generator.component.css']
})
export class ZplGeneratorComponent {
  public zpl: string = '';
  public showModal: boolean = false;

  /**
   * Gera o código ZPL a partir dos elementos dentro do canvas.
   * Exibe o modal após a geração do código.
   */
  public generateZPL(): void {
    console.log('Iniciando geração do ZPL...');

    const canvas = document.getElementById('canvas') as HTMLElement;
    if (!canvas) {
      this.handleError('Canvas não encontrado!');
      return;
    }

    this.zpl = this.buildZPL(canvas);
    this.showModal = true;

    console.log('Código ZPL gerado:', this.zpl);
  }

  /**
   * Constrói o código ZPL baseado no canvas fornecido.
   * 
   * @param {HTMLElement} canvas - O elemento HTML que contém os textos e imagens a serem convertidos para ZPL.
   * @returns {string} O código ZPL gerado.
   * 
   * @example
   * const zplCode = this.buildZPL(document.getElementById('canvas'));
   */
  private buildZPL(canvas: HTMLElement): string {
    let zpl = '^XA\n';

    const textElements = canvas.querySelectorAll('div');
    const imageElements = canvas.querySelectorAll('img');

    zpl += this.processTextElements(textElements, canvas);
    zpl += this.processImageElements(imageElements, canvas);

    zpl += '^XZ';
    return zpl;
  }

  /**
   * Processa os elementos de texto dentro do canvas e converte para código ZPL.
   * 
   * @param {NodeListOf<HTMLDivElement>} textElements - Lista de elementos de texto dentro do canvas.
   * @param {HTMLElement} canvas - O elemento canvas que contém os textos.
   * @returns {string} Código ZPL correspondente aos textos.
   */
  private processTextElements(textElements: NodeListOf<HTMLDivElement>, canvas: HTMLElement): string {
    let zpl = '';

    textElements.forEach((text) => {
      const content = text.textContent?.trim() || '';
      const fontSize = this.parseFontSize(text.style.fontSize);
      const { left, top } = this.getElementPosition(text, canvas);

      zpl += `^FO${left},${top}^A0N,${fontSize},${fontSize}^FD${content}^FS\n`;
    });

    return zpl;
  }

  /**
   * Processa os elementos de imagem dentro do canvas e converte para código ZPL.
   * 
   * @param {NodeListOf<HTMLImageElement>} imageElements - Lista de elementos de imagem dentro do canvas.
   * @param {HTMLElement} canvas - O elemento canvas que contém as imagens.
   * @returns {string} Código ZPL correspondente às imagens.
   */
  private processImageElements(imageElements: NodeListOf<HTMLImageElement>, canvas: HTMLElement): string {
    let zpl = '';

    imageElements.forEach((img) => {
      const { left, top } = this.getElementPosition(img, canvas);
      zpl += `^FO${left},${top}^GFA,100,100,10,${img.src}^FS\n`;
    });

    return zpl;
  }

  /**
   * Obtém a posição relativa de um elemento dentro do canvas.
   * 
   * @param {HTMLElement} element - O elemento a ser posicionado.
   * @param {HTMLElement} canvas - O elemento canvas de referência.
   * @returns {{ left: number, top: number }} As coordenadas relativas do elemento.
   * 
   * @example
   * const position = this.getElementPosition(element, canvas);
   * console.log(position.left, position.top);
   */
  private getElementPosition(element: HTMLElement, canvas: HTMLElement): { left: number; top: number } {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    return {
      left: Math.round(rect.left - canvasRect.left),
      top: Math.round(rect.top - canvasRect.top),
    };
  }

  /**
   * Converte um tamanho de fonte CSS para número.
   * 
   * @param {string} fontSize - O tamanho da fonte como string (ex: '12px').
   * @returns {number} O tamanho da fonte convertido para número.
   * 
   * @example
   * const size = this.parseFontSize('14px'); // Retorna 14
   */
  private parseFontSize(fontSize: string): number {
    return parseInt(fontSize, 10) || 10;
  }

  /**
   * Copia o código ZPL gerado para a área de transferência.
   * Exibe um alerta informando o sucesso ou erro.
   */
  public copyZPL(): void {
    navigator.clipboard.writeText(this.zpl).then(() => {
      alert('Código ZPL copiado com sucesso!');
    }).catch(err => {
      this.handleError('Erro ao copiar ZPL', err);
    });
  }

  /**
   * Fecha o modal de exibição do código ZPL.
   */
  public closeModal(): void {
    this.showModal = false;
  }

  /**
   * Manipula erros e exibe no console.
   * 
   * @param {string} message - A mensagem de erro a ser exibida.
   * @param {any} [error] - (Opcional) O erro capturado.
   * 
   * @example
   * this.handleError('Erro ao carregar imagem');
   */
  private handleError(message: string, error?: any): void {
    console.error(`Erro: ${message}`, error || '');
  }
}
