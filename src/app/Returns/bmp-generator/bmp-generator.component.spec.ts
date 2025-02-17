import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmpGeneratorComponent } from './bmp-generator.component';

describe('BmpGeneratorComponent', () => {
  let component: BmpGeneratorComponent;
  let fixture: ComponentFixture<BmpGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmpGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmpGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
