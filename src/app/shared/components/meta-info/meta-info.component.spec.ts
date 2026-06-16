import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaInfoComponent } from './meta-info.component';

describe('MetaInfoComponent', () => {
  let component: MetaInfoComponent;
  let fixture: ComponentFixture<MetaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetaInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetaInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
