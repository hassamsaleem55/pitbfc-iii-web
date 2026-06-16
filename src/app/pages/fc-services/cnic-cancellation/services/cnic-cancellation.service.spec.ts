import { TestBed } from '@angular/core/testing';

import { CnicCancellationService } from './cnic-cancellation.service';

describe('CnicCancellationService', () => {
  let service: CnicCancellationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CnicCancellationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
