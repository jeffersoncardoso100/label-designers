import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private shapes = new BehaviorSubject<any[]>([]);
  currentShapes = this.shapes.asObservable();

  constructor() {}

  /**Adição de formas */
  addShape(shape: any) {
    const currentShapes = this.shapes.getValue();
    this.shapes.next([...currentShapes, shape]);
  }
  /**Edição de formas */
  updateShape(index: number, updatedShape: any) {
    const currentShapes = this.shapes.getValue();
    currentShapes[index] = updatedShape;
    this.shapes.next(currentShapes);
  }

  /** Remoção das formas */
  removeShape(index: number) {
    const currentShapes = this.shapes.getValue();
    currentShapes.splice(index, 1);
    this.shapes.next(currentShapes);
  }
}