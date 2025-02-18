// src/app/services/text-style.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextStyleService {
  private styles = {
    isBold: false,
    isItalic: false,
    isUnderlined: false
  };

  constructor() { }

  // Métodos para alterar os estilos
  setBold(value: boolean): void {
    this.styles.isBold = value;
  }

  setItalic(value: boolean): void {
    this.styles.isItalic = value;
  }

  setUnderline(value: boolean): void {
    this.styles.isUnderlined = value;
  }

  // Métodos para obter os estilos
  getBold(): boolean {
    return this.styles.isBold;
  }

  getItalic(): boolean {
    return this.styles.isItalic;
  }

  getUnderline(): boolean {
    return this.styles.isUnderlined;
  }

  // Método para obter todos os estilos de uma vez
  getStyles(): { isBold: boolean, isItalic: boolean, isUnderlined: boolean } {
    return this.styles;
  }
}
