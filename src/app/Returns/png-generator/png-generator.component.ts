import { AfterViewInit, Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-png-generator',
  templateUrl: './png-generator.component.html',
  styleUrls: ['./png-generator.component.css']
})
export class PngGeneratorComponent implements AfterViewInit {
  showModal = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.modalType === 'png' && state.open) {
        this.showModal = true;
        setTimeout(() => this.generatePNG(), 200); // Pequeno delay para garantir que o canvas esteja pronto
      } else {
        this.showModal = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupCanvas(); // Configura o canvas após a view ser inicializada
  }

  setupCanvas(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = 800; // Dimensões fixas
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white'; // Fundo branco
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Teste PNG', 50, 50); // Exemplo de texto
      }
    }
  }

  generatePNG(): void {
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvasElement) {
      console.error('Canvas não encontrado!');
      return;
    }

    html2canvas(canvasElement, { scale: 2 }).then((canvas) => {
      const imgURL = canvas.toDataURL('image/png');
      this.downloadImage(imgURL);
    });
  }

  downloadImage(imageUrl: string): void {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'canvas_image.png';
    a.click();
  }
}