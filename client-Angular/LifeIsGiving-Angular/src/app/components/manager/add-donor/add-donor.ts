import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Users } from '../../../core/services/users'; // ✅ ADD

@Component({
  selector: 'app-add-donor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-donor.html',
  styleUrl: './add-donor.scss',
})
export class AddDonor {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private usersService = inject(Users); // ✅ ADD

  private endpoint = `${environment.apiUrl}/api/User`;

  loading = false;
  errorMsg = '';
  successMsg = '';

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

  close(): void {
    this.router.navigate(['/admin/donors']);
  }

  reset(): void {
    this.form.reset();
    this.errorMsg = '';
    this.successMsg = '';
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const donorData = {
      ...this.form.getRawValue(),
      role: 1,
    };

    this.loading = true;

    this.http.post(this.endpoint, donorData, { headers: this.buildHeaders() }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'התורם נוסף בהצלחה ✅';

        this.usersService.triggerDonorsRefresh(); // ✅ FIX: גורם לרשימה להיטען מחדש

        this.router.navigate(['/admin/donors']);
      },
      error: (error) => {
        this.loading = false;

        if (error?.status === 401) {
          this.errorMsg = '401 Unauthorized: אין הרשאה (בדקי טוקן)';
        } else {
          this.errorMsg =
            error?.error?.message ||
            error?.error?.title ||
            error?.message ||
            'שגיאה לא ידועה';
        }

        console.error('Error adding donor:', error);
      },
    });
  }
}
