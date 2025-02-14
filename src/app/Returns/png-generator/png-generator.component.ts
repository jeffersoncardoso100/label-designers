import { Component } from '@angular/core';
import html2canvas from 'html2canvas';  // Importando a biblioteca html2canvas
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-png-generator',
  templateUrl: './png-generator.component.html',
  styleUrls: ['./png-generator.component.css']
})
export class PngGeneratorComponent {
  png: any;

  showModal = false;

  constructor(private modalService: ModalService) { }


  ngOnInit(): void {
    // Escutando mudanças de estado no serviço de modal
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'png' && state.open) {
        this.showModal = true;
        this.generatePNG();  // Gera o ZPL automaticamente quando o modal for aberto
      } else {
        this.showModal = false;
      }
    });
  }

  generatePNG(): void {
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvasElement) {
      html2canvas(canvasElement).then((canvas) => {
        const imgURL = canvas.toDataURL('image/png');
        this.downloadImage(imgURL);
      });
    }
  }

  downloadImage(imageUrl: string): void {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'canvas_image.png';
    a.click();
  }
}
