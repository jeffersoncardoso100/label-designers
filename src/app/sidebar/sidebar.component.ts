import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { ZplGeneratorComponent } from "../Returns/zpl-generator/zpl-generator.component";
import { PngGeneratorComponent } from "../Returns/png-generator/png-generator.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [ZplGeneratorComponent, PngGeneratorComponent]
})
export class SidebarComponent {

  constructor(private modalService: ModalService) { }

  // Abre o modal para adicionar texto
  openTextModal(): void {
    this.modalService.openModal('text', { textContent: 'Novo Texto', textSize: 10 });
  }

  // Abre o modal para adicionar imagem
  openImageModal(): void {
    this.modalService.openModal('image', { imageUrl: '' });
  }

  // Chama a geração de ZPL no modal
  generateZPL(): void {
    this.modalService.openModal('zpl', { zplContent: 'Código ZPL gerado aqui' });
  }

  // Chama a geração de PNG no modal
  generatePNG(): void {
    this.modalService.openModal('png', { pngContent: 'Imagem PNG gerada aqui' });
  }
}
