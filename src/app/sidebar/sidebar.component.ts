import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private modalService: ModalService) {}

  openTextModal() {
    this.modalService.openModal('text');
  }

  openImageModal() {
    this.modalService.openModal('image');
  }

  openZplGenerator() {
    this.modalService.openModal('zpl');
  }

  openPngGenerator() {
    this.modalService.openModal('png');
  }
}
