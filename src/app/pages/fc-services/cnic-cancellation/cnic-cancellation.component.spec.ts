import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnicCancellationComponent } from './cnic-cancellation.component';

describe('CnicCancellationComponent', () => {
  let component: CnicCancellationComponent;
  let fixture: ComponentFixture<CnicCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CnicCancellationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CnicCancellationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
