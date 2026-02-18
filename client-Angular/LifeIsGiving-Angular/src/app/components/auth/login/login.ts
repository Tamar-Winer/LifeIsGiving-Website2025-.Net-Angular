import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private msg = inject(MessageService);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.msg.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Please provide a valid username and password',
        life: 3000
      });

      return;
    }

    const payload = this.loginForm.getRawValue();

    this.auth.login(payload).subscribe({
      next: () => {
        this.msg.add({ 
          severity: 'success', 
          summary: 'Welcome Back!', 
          detail: 'Login successful, redirecting...', 
          life: 2000 ,
        });
        setTimeout(() => window.location.href = '/prizes', 1500);
      },
      error: (err) => this.handleLoginError(err),
    });
  }

  private handleLoginError(err: any) {
    // 401: Unauthorized
    if (err?.status === 401) {
      this.msg.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Incorrect username or password',
        life: 4000
      });
      return;
    }

    // 400: Bad Request
    if (err?.status === 400) {
      const message = err?.error?.message || 'Invalid data provided';
      this.msg.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 4000
      });
      return;
    }

    // 500 or other errors
    this.msg.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'A server error occurred. Please try again in a few moments.',
      life: 4500
    });

    console.error('Login failed:', err);
  }

  hasError(field: string) {
    const c = this.loginForm.get(field);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }
}