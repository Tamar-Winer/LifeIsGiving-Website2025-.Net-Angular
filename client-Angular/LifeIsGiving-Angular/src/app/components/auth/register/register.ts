import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  private fb: FormBuilder = inject(FormBuilder);
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{8,9}$/)]],
    address: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],

  });

submit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  const values = this.registerForm.getRawValue();

  // שימוש ב-any מונע מ-TypeScript לבדוק אם זה מתאים ל-RegisterRequest
  const payload: any = {
    UserName: values.username,
    Name: values.name,
    Email: values.email,
    Phone: values.phone,
    Address: values.address,
    Password: values.password,
    Role: 3 
  };

  this.auth.register(payload).subscribe({
    next: () => this.router.navigateByUrl('/login'),
    error: (err) => console.error('Register failed:', err),
  });
}

  hasError(field: string) {
    const c = this.registerForm.get(field);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }
}
