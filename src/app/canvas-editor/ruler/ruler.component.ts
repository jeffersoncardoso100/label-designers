import { CommonModule } from '@angular/common';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ruler',
  imports:[CommonModule],
  templateUrl: './ruler.component.html',
  styleUrls: ['./ruler.component.css']
})
export class RulerComponent implements AfterViewInit {
  @ViewChild('horizontalRuler') horizontalRuler!: ElementRef;
  @ViewChild('verticalRuler') verticalRuler!: ElementRef;

  // Definindo as propriedades para as marcas da régua
  horizontalMarks: number[] = [];
  verticalMarks: number[] = [];

  // Variáveis de controle para o movimento
  isDraggingHorizontal = false;
  isDraggingVertical = false;
  offsetX: number = 0;
  offsetY: number = 0;

  ngAfterViewInit() {
    this.createHorizontalRuler();
    this.createVerticalRuler();
    this.addDragEvent();
  }

  // Criar a régua horizontal
  createHorizontalRuler() {
    const ruler = this.horizontalRuler.nativeElement;
    for (let i = 0; i <= window.innerWidth; i += 10) {
      this.horizontalMarks.push(i);
    }
  }

  // Criar a régua vertical
  createVerticalRuler() {
    const ruler = this.verticalRuler.nativeElement;
    for (let i = 0; i <= window.innerHeight; i += 10) {
      this.verticalMarks.push(i);
    }
  }

  // Função para adicionar os eventos de movimentação
  addDragEvent() {
    const horizontalRuler = this.horizontalRuler.nativeElement;
    const verticalRuler = this.verticalRuler.nativeElement;

    horizontalRuler.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDraggingHorizontal = true;
      this.offsetX = e.clientX - horizontalRuler.getBoundingClientRect().left;
    });

    verticalRuler.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDraggingVertical = true;
      this.offsetY = e.clientY - verticalRuler.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDraggingHorizontal) {
        const newLeft = e.clientX - this.offsetX;
        horizontalRuler.style.left = `${newLeft}px`;
      }

      if (this.isDraggingVertical) {
        const newTop = e.clientY - this.offsetY;
        verticalRuler.style.top = `${newTop}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDraggingHorizontal = false;
      this.isDraggingVertical = false;
    });
  }
}
