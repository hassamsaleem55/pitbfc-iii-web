import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-details.component.html',
  styleUrl: './address-details.component.css',
})
export class AddressDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  @Output() formReady = new EventEmitter<FormGroup>();

  public form: FormGroup = this.fb.group({
    houseNo: [''],
    streetNo: [''],
    blockNo: [''],
    neighbourhood: [''],
    additionalInfo: [''],
    city: [''],
    address: [''],
    division: ['LAHORE', Validators.required],
    district: [''],
    tehsil: [''],
    ucNo: ['', Validators.required]
  });

  ngOnInit() {
    this.formReady.emit(this.form);
  }
}