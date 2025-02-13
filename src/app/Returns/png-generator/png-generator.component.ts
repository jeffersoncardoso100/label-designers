import { Component } from '@angular/core';
import html2canvas from 'html2canvas';  // Importando a biblioteca html2canvas

@Component({
  selector: 'app-png-generator',
  templateUrl: './png-generator.component.html',
  styleUrls: ['./png-generator.component.css']
})
export class PngGeneratorComponent {
  png: any;

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
