import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Disponível em toda a aplicação
})
export class DeleteService {
  // Deleta um elemento do DOM, se ele existir e tiver um pai
  deleteElement(element: HTMLElement | null): boolean {
    if (element && element.parentElement) {
      element.parentElement.removeChild(element);
      return true; // Sucesso na deleção
    }
    return false; // Falha (elemento não existe ou não tem pai)
  }
}