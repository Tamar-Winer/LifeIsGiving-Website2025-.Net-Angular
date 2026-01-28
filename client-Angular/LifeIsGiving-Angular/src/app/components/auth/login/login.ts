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
    this.msg.add({ severity: 'success', summary: 'בדיקה', detail: 'Toast עובד', life: 2000 });

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.msg.add({
        severity: 'warn',
        summary: 'שימי לב',
        detail: 'נא למלא שם משתמש וסיסמה תקינים',
        life: 3000
      });

      return;
    }

    const payload = this.loginForm.getRawValue();

    this.auth.login(payload).subscribe({
      next: () => this.router.navigateByUrl('/prizes'),
      error: (err) => this.handleLoginError(err),
    });
  }

  private handleLoginError(err: any) {
    // אם השרת יחזיר 401 כשפרטים לא נכונים
    if (err?.status === 401) {
      this.msg.add({
        severity: 'error',
        summary: 'התחברות נכשלה',
        detail: 'שם משתמש או סיסמה אינם נכונים',
        life: 4000
      });
      return;
    }

    // אם השרת מחזיר 400 עם הודעה
    if (err?.status === 400) {
      const message = err?.error?.message || 'נתונים לא תקינים';
      this.msg.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: message,
        life: 4000
      });
      return;
    }

    // כרגע אצלך זה 500 — נציג הודעה ברורה למשתמש
    this.msg.add({
      severity: 'error',
      summary: 'שגיאת שרת',
      detail: 'אירעה תקלה בשרת. נסי שוב בעוד רגע.',
      life: 4500
    });

    console.error('Login failed:', err);
  }

  hasError(field: string) {
    const c = this.loginForm.get(field);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }
}
