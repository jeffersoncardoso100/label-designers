import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZplGeneratorComponent } from './zpl-generator.component';

describe('ZplGeneratorComponent', () => {
  let component: ZplGeneratorComponent;
  let fixture: ComponentFixture<ZplGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZplGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZplGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
