import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-info',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.css',
})
export class GeneralInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  @Output() formReady = new EventEmitter<FormGroup>();

  public form: FormGroup = this.fb.group({
    applicantName: [''],
    applicantNameUrdu: [''],
    fatherName: [''],
    fatherNameUrdu: [''],
    applicantCnic: [''],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    religion: ['', Validators.required],
    issuanceDate: [''],
    issuanceNo: ['']
  });

  ngOnInit() {
    this.formReady.emit(this.form);
  }
}
