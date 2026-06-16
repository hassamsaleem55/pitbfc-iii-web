import { Component, signal, ViewChild, ElementRef, inject, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-visitor-info',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visitor-info.component.html',
  styleUrl: './visitor-info.component.css',
})
export class VisitorInfoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);

  @Output() formReady = new EventEmitter<FormGroup>();

  // LOV Data Arrays
  statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];
  serviceTypes = ['SIMPLE CARD', 'SMART CARD'];
  deliveryTypes = ['NORMAL', 'URGENT'];
  applicationTypes = ['NEW', 'MODIFICATION'];
  visitorTypes = ['SELF', 'BLOOD RELATIVE', 'LEGAL REPRESENTATIVE'];
  objections = ['NONE', 'INCOMPLETE DOCUMENTS', 'BIOMETRIC MISMATCH', 'ADDRESS VERIFICATION FAILED'];
  mobileHolders = ['SELF', 'FATHER', 'MOTHER', 'SPOUSE', 'OTHER'];

  public form: FormGroup = this.fb.group({
    qmaticDate: [{ value: '', disabled: true }],
    qmaticTime: [{ value: '', disabled: true }],
    qmaticId: ['', Validators.required],
    status: ['PENDING', Validators.required],
    serviceType: ['SIMPLE CARD', Validators.required],
    deliveryType: ['NORMAL', Validators.required],
    applicationType: ['NEW', Validators.required],
    serviceFee: ['0'],
    challanNo: [''],
    objection: ['NONE'],
    deliveryDate: [''],
    visitorType: ['SELF', Validators.required],
    // Validation: Required + Pattern (5 digits - 7 digits - 1 digit)
    visitorCnic: ['', [
      Validators.required,
      Validators.pattern(/^\d{5}-\d{7}-\d{1}$/)
    ]],
    visitorMobileHolder: ['SELF'],
    // Validation: Pattern (Starting with 03 and then 9 digits)
    visitorMobileNo: ['', [
      Validators.pattern(/^03\d{9}$/)
    ]],
    // Validation: Required + Letters and spaces only
    visitorName: ['', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z\s]*$/)
    ]],
    visitorAddress: [''],
    visitorPhoto: [''],
    remarks: ['', Validators.required]
  });

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  imagePreview = signal<string | null>(null);
  isCameraActive = false;
  stream: MediaStream | null = null;

  ngOnInit() {
    this.initializeVisitorFields();
    this.formReady.emit(this.form);
  }

  private initializeVisitorFields() {
    const now = new Date();

    // 1. Get Current Date (DD/MM/YYYY)
    const qDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    // 2. Get Current Time (HH:MM AM/PM)
    const qTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 3. Generate Unique Qmatic ID (Example: QM-171584-ABCD)
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueId = `QM-${now.getTime().toString().slice(-6)}-${randomStr}`;

    // 4. Set Delivery Date (Today + 10 days)
    // HTML5 date input requires YYYY-MM-DD format
    const delDate = new Date();
    delDate.setDate(now.getDate() + 10);
    // const formattedDelDate = delDate.toISOString().split('T')[0];
    const formattedDelDate = `${delDate.getDate()}/${delDate.getMonth() + 1}/${delDate.getFullYear()}`;

    this.form.patchValue({
      qmaticDate: qDate,
      qmaticTime: qTime,
      qmaticId: uniqueId,
      deliveryDate: formattedDelDate
    });
  }

  // Camera & File logic below remains the same...
  triggerUpload() { this.stopCamera(); this.fileInput.nativeElement.click(); }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.imagePreview.set(base64);
        this.form.patchValue({ visitorPhoto: base64 });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // ... inside VisitorInfo class

  // Formatter for CNIC: 00000-0000000-0
  onCnicInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digits

    if (value.length > 13) value = value.slice(0, 13); // Limit to 13 digits

    let formatted = '';
    if (value.length > 0) {
      formatted = value.substring(0, 5);
      if (value.length > 5) {
        formatted += '-' + value.substring(5, 12);
      }
      if (value.length > 12) {
        formatted += '-' + value.substring(12, 13);
      }
    }

    // Update the form control and the input display
    this.form.patchValue({ visitorCnic: formatted }, { emitEvent: false });
    input.value = formatted;
  }

  // Formatter for Mobile: 03XXXXXXXXX (11 digits)
  onMobileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digits

    // Optional: Force start with 03
    if (value.length > 0 && value[0] !== '0') value = '0' + value;
    if (value.length > 1 && value[1] !== '3') value = value[0] + '3' + value.substring(2);

    if (value.length > 11) value = value.slice(0, 11); // Limit to 11 digits

    this.form.patchValue({ visitorMobileNo: value }, { emitEvent: false });
    input.value = value;
  }

  async startCamera() {
    this.imagePreview.set(null);
    this.isCameraActive = true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 320 } });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (err) {
      alert("Could not access camera.");
      this.isCameraActive = false;
    }
  }

  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      this.imagePreview.set(dataUrl);
      this.form.patchValue({ visitorPhoto: dataUrl });
      this.stopCamera();
    }
  }

  stopCamera() {
    if (this.stream) { this.stream.getTracks().forEach(track => track.stop()); }
    this.isCameraActive = false;
  }

  clearPhoto() {
    this.imagePreview.set(null);
    this.form.patchValue({ visitorPhoto: '' });
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  ngOnDestroy() { this.stopCamera(); }
}
