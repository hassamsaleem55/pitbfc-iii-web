import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wizard',
  imports: [CommonModule],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css',
})
export class WizardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) steps: string[] = [];
  @Input() currentStep = 1;
  @Input() isSaving = false;
  @Input() finalStepText = 'Submit Final Application';

  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length;
  }
}
