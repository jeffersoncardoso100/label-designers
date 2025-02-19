import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ShapeService } from '../../services/shapes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-shape-modal',
  imports:[FormsModule,CommonModule],
  templateUrl: './shape-modal.component.html',
  styleUrls: ['./shape-modal.component.css']
})
export class ShapeModalComponent {
  showModal: boolean = false;
  shapeType: string = 'square';
  borderWidth: string = '1px';
  borderColor: string = '#000000';
  fillColor: string = '#ffffff';

  @Output() shapeAdded = new EventEmitter<any>();

  constructor(
    private modalService: ModalService,
    private shapeService: ShapeService
  ) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'shape' && state.open) {
        this.showModal = true;
      } else if (state.modalType === 'shape' && !state.open) {
        this.showModal = false;
      }
    });
  }

  addShape(): void {
    const shape = {
      type: this.shapeType,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      fillColor: this.fillColor
    };

    this.shapeService.addShape(shape);
    this.shapeAdded.emit(shape);
    this.closeModal();
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.showModal = false;
  }
}