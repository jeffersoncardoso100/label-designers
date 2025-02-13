import { Component } from '@angular/core';
import { CanvasEditorComponent } from "./canvas-editor/canvas-editor.component";

import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ FormsModule, CommonModule, CanvasEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Editor de Etiquetas';
}
