import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject, switchMap, startWith, shareReplay } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Donor } from '../models/Donor';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private apiUrl = `${environment.apiUrl}/api/User`;

  // ✅ טריגר לרענון
  private refresh$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  // ✅ stream של תורמים שמתעדכן בכל refresh
  donors$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() => this.http.get<any[]>(`${this.apiUrl}/donors`)),
    shareReplay(1)
  );

  // ✅ לקרוא לזה אחרי add/edit/delete
  triggerDonorsRefresh() {
    this.refresh$.next();
  }

  GetDonors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donors`);
  }

  AddUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user);
  }

  // ✅ FIX: לשלוח Bearer token כי השרת דורש Admin
  DeleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // ⚠️ אם שמרת בשם אחר - החליפי כאן
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  UpdateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

   filterDonors(name?: string, email?: string, prizeName?: string): Observable<Donor[]> {
    let params = new HttpParams();

    if (name?.trim()) params = params.set('name', name.trim());
    if (email?.trim()) params = params.set('email', email.trim());
    if (prizeName?.trim()) params = params.set('prizeName', prizeName.trim());

    return this.http.get<Donor[]>(`${this.apiUrl}/filteringBy`, { params });
  }



  
}
