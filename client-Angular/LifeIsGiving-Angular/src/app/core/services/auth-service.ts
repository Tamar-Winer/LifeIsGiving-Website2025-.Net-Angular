import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // שדה זה צריך להתאים לשם השדה שמחזיר ה-API עם שם המשתמש
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/Auth`;
 currentUser = signal<string | null>(this.getNameFromToken());

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
     tap(res => {
      localStorage.setItem('token', res.token);
      
     
      this.currentUser.set(this.getNameFromToken()); 
    })
    );
  }
  private getNameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // ב-NET Core השם בדרך כלל נמצא תחת המפתח 'unique_name' או 'name'
      return payload['unique_name'] || 
             payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
             payload['name'] || 
             null;
    } catch (e) {
      return null;
    }
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/User`, data).pipe(
      tap(res => {
        if (res?.token) localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
   localStorage.removeItem('token');
  this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // פונקציה חדשה: בודקת האם המשתמש מנהל לפי הטוקן
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // פענוח ה-JWT (החלק האמצעי מכיל את הנתונים)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // בדיקה של השדות הנפוצים בטוקן לתפקיד מנהל
      // לעיתים זה מופיע כ-'role' ולעיתים כקישור מלא של מיקרוסופט
      const userRole = payload['role'] || 
                       payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      return userRole === 'Admin';
    } catch (e) {
      return false;
    }
  }
}
