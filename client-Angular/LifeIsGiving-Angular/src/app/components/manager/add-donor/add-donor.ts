import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Users } from '../../../core/services/users';
import { MessageService } from 'primeng/api'; // ✅ הוספת שירות הודעות
import { ToastModule } from 'primeng/toast'; // ✅ ייבוא מודול טוסט

@Component({
  selector: 'app-add-donor',
  standalone: true, // וודאי שזה מוגדר כ-Standalone
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastModule],
  providers: [MessageService], // ✅ חיוני עבור הטוסט
  templateUrl: './add-donor.html',
  styleUrl: './add-donor.scss',
})
export class AddDonor {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private usersService = inject(Users);
  private messageService = inject(MessageService); // ✅ הזרקת השירות

  private endpoint = `${environment.apiUrl}/api/User`;
@Output() onClose = new EventEmitter<void>();
  loading = false;
  errorMsg = '';

  form = this.fb.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  private buildHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  close() {
    this.onClose.emit(); // שולח הודעה לאמא: "תסגרי אותי!"
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validation Error', 
        detail: 'Please fill all required fields correctly' 
      });
      return;
    }

    const donorData = { ...this.form.getRawValue(), role: 1 };
    this.loading = true;
    this.errorMsg = '';

    this.http.post(this.endpoint, donorData, { headers: this.buildHeaders() }).subscribe({
      next: () => {
        this.loading = false;
        // ✅ הודעת הצלחה בטוסט
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Donor account created successfully!' 
        });

        this.usersService.triggerDonorsRefresh();
        
        // השהייה קלה כדי שהמשתמש יראה את הטוסט לפני המעבר
        setTimeout(() => this.close(), 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMsg = error?.error?.message || 'Failed to create donor account.';
        
        // ✅ הודעת שגיאה בטוסט
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: this.errorMsg 
        });
      },
    });
  }
}