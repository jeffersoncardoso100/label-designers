import { TestBed } from '@angular/core/testing';

import { TextStyleService } from './text-style.service';

describe('TextStyleService', () => {
  let service: TextStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
