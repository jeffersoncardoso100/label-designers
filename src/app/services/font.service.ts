import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontService {
  private fonts: string[] = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Comic Sans MS'
  ];

  constructor() {}

  // Retorna a lista de fontes disponíveis
  getFonts(): string[] {
    return this.fonts;
  }
}
