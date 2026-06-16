import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailsComponent } from './address-details.component';

describe('AddressDetailsComponent', () => {
  let component: AddressDetailsComponent;
  let fixture: ComponentFixture<AddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
