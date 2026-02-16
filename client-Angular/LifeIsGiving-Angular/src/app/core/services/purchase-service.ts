import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ייבוא חסר
import { Observable } from 'rxjs'; // ייבוא מקוצר ותקני

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  // החליפי לכתובת ה-API האמיתית שלך
  private apiUrl = 'http://localhost:5006/api/Purchases'; 

  constructor(private http: HttpClient) {} // הזרקת ה-HttpClient

// core/services/purchase-service.ts

getPurchasesByPrize(prizeId: number): Observable<any[]> {
  // אנחנו מוסיפים את ה-ID לכתובת ה-URL
  // השרת יקרא את זה מה- [FromQuery] int? prizeId
  return this.http.get<any[]>(`${this.apiUrl}/admin/report?prizeId=${prizeId}`);
}

  // פונקציה נוספת שתצטרכי עבור המיונים הכלליים
  getAdminReport(sortBy?: string): Observable<any[]> {
    let url = `${this.apiUrl}/admin/report`;
    if (sortBy) {
      url += `?sortBy=${sortBy}`;
    }
    return this.http.get<any[]>(url);
  }
}