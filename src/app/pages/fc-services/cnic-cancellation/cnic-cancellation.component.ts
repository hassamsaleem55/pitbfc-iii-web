import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { WizardComponent } from '../../../shared/components/wizard/wizard.component';
import { VisitorInfoComponent } from '../../../shared/components/visitor-info/visitor-info.component';
import { GeneralInfoComponent } from '../../../shared/components/general-info/general-info.component';
import { AddressDetailsComponent } from '../../../shared/components/address-details/address-details.component';

@Component({
  selector: 'app-cnic-cancellation',
  imports: [CommonModule, ReactiveFormsModule, WizardComponent, VisitorInfoComponent, GeneralInfoComponent, AddressDetailsComponent],
  templateUrl: './cnic-cancellation.component.html',
  styleUrl: './cnic-cancellation.component.css',
})
export class CnicCancellationComponent {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  wizardSteps = ['Visitor Info', 'General Info', 'Address Details'];
  currentStep = 1;
  isSaving = false;

  // The master form remains but its internal groups are populated by children
  cancellationForm: FormGroup = this.fb.group({
    visitor: this.fb.group({}),
    general: this.fb.group({}),
    address: this.fb.group({})
  });

  // Handlers to link child forms to the master form
  handleFormReady(step: string, group: FormGroup) {
    this.cancellationForm.setControl(step, group);
    this.cdr.detectChanges();
  }

  onPreviousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  async onNextStep() {
    const activeGroupName = this.currentStep === 1 ? 'visitor' : this.currentStep === 2 ? 'general' : 'address';
    const activeGroup = this.cancellationForm.get(activeGroupName) as FormGroup;

    if (activeGroup.invalid) {
      activeGroup.markAllAsTouched();
      alert(`Please fill all required fields in ${this.wizardSteps[this.currentStep - 1]}.`);
      return;
    }

    this.isSaving = true;
    try {
      const stepName = this.wizardSteps[this.currentStep - 1];
      await this.postData(stepName, activeGroup.getRawValue());

      if (this.currentStep < this.wizardSteps.length) {
        this.currentStep++;
      } else {
        alert('Process Complete!');
        console.log('FINAL DATA:', this.cancellationForm.getRawValue());
      }
    } catch (e) {
      alert('Error saving data.');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  private postData(stepName: string, data: any): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => {
      console.log(`Saved ${stepName}:`, data);
      resolve(true);
    }, 1000));
  }
}
