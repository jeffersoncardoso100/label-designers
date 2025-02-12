import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-modal',
  imports: [FormsModule],
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.css']
})
export class TextModalComponent {
  /** Texto que será mostrado no modal */
  @Input() textContent: string = '';

  /** Tamanho da fonte do texto */
  @Input() textSize: number = 10;

  /** Emissor de evento para atualizar o conteúdo do texto no componente pai */
  @Output() textContentChange = new EventEmitter<string>();

  /** Emissor de evento para atualizar o tamanho do texto no componente pai */
  @Output() textSizeChange = new EventEmitter<number>();

  /** Emissor de evento para notificar que o texto foi adicionado */
  @Output() addTextEvent = new EventEmitter<void>();

  /** Emissor de evento para notificar que o modal foi fechado */
  @Output() closeModalEvent = new EventEmitter<void>();

  /** 
   * Atualiza o conteúdo do texto e emite a alteração para o componente pai
   * @param value O novo conteúdo do texto
   */
  public updateTextContent(value: string): void {
    this.textContentChange.emit(value); // Emite o novo valor do texto
  }

  /** 
   * Atualiza o tamanho da fonte do texto e emite a alteração para o componente pai
   * @param value O novo tamanho da fonte
   */
  public updateTextSize(value: number): void {
    this.textSizeChange.emit(Number(value)); // Emite o novo valor do tamanho
  }

  /** 
   * Emite um evento para adicionar o texto
   */
  public addText(): void {
    this.addTextEvent.emit(); // Notifica que o texto foi adicionado
  }

  /** 
   * Emite um evento para fechar o modal
   */
  public closeModal(): void {
    this.closeModalEvent.emit(); // Notifica que o modal deve ser fechado
  }
}
