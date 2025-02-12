import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PngGeneratorComponent } from './png-generator.component';

describe('PngGeneratorComponent', () => {
  let component: PngGeneratorComponent;
  let fixture: ComponentFixture<PngGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PngGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PngGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
