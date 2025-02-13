import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<any>({});

  /**  Observable para acessar o estado dos modais*/
  modalState$ = this.modalState.asObservable();

  /**Função para abrir qualquer modal*/
  openModal(modalType: string, data?: any): void {
    this.modalState.next({ modalType, data, open: true });
  }

 /**Função para fechar o modal*/
  closeModal(): void {
    this.modalState.next({ ...this.modalState.value, open: false });
  }
}
