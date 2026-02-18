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
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule // הוספה
  ],
  providers: [MessageService], // הוספת השירות ברמת הקומפוננטה
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  private fb: FormBuilder = inject(FormBuilder);
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private messageService = inject(MessageService); 

  loading: boolean = false; 

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
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please check the highlighted fields' 
      });
      return;
    }

    this.loading = true; // התחלת טעינה
    const values = this.registerForm.getRawValue();

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
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Account created successfully!' 
        });
        
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Registration Failed', 
          detail: 'Server error or user already exists' 
        });
        console.error('Register failed:', err);
      },
    });
  }

  hasError(field: string) {
    const c = this.registerForm.get(field);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }
}