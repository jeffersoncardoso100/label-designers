import { Component } from '@angular/core';
import { CanvasEditorComponent } from "./canvas-editor/canvas-editor.component";
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [CanvasEditorComponent,FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Editor de Etiquetas';
}











