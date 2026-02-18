import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prize } from '../models/Prize';

@Injectable({
  providedIn: 'root'
})
export class PrizeService {

  private apiUrl = `${environment.apiUrl}/api/Prize`;

  constructor(private http: HttpClient) {}

  getAllPrizes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPrizeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deletePrize(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  addPrize(prize: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, prize);
    }
    
  updatePrize(prize: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${prize.id}`, prize);
  }

  searchPrizes(prizeName?: string, donorName?: string, exactBuyers?: number | null): Observable<Prize[]> {
  let params = new HttpParams();

  // הוספת פרמטרים רק אם יש בהם ערך (כדי לא לשלוח סתם "null" לשרת)
  if (prizeName) {
    params = params.set('prizeName', prizeName);
  }
  if (donorName) {
    params = params.set('donorName', donorName);
  }
  if (exactBuyers !== null && exactBuyers !== undefined) {
    params = params.set('exactBuyers', exactBuyers.toString());
  }

  // שימי לב: הכתובת חייבת להתאים ל-Route של הקונטרולר שלך
  return this.http.get<Prize[]>(`${this.apiUrl}/search`, { params });

  
}

// prize-service.ts
uploadImage(formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 
  // שימי לב: לא מגדירים Content-Type ב-FormData, הדפדפן עושה זאת לבד
  return this.http.post(`${this.apiUrl}/upload`, formData, { headers });
}
}
