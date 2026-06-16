import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorInfoComponent } from './visitor-info.component';

describe('VisitorInfoComponent', () => {
  let component: VisitorInfoComponent;
  let fixture: ComponentFixture<VisitorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitorInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
