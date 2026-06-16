import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { LoginRequest } from '../../core/auth/dtos/login-request.dto';
import { LoginResponse } from '../../core/auth/dtos/login-response.dto';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isSubmitting = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const request: LoginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(request)
        .subscribe({
          next: (response: LoginResponse) => {
            this.isSubmitting = false;
            this.authService.loginSuccess(response);
          },
          error: (error) => {
            this.isSubmitting = false;
            alert('Invalid username or password');
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
