// core/services/winning.service.ts
import { Injectable, inject } from '@angular/core'; // התיקון כאן: core במקום common/any
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WinningService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5006/api/Winning';

  // הרצת הגרלה - מקבל JSON עם פרטי הזוכה
  runLottery(prizeId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/run/${prizeId}`, {});
  }

  // בדיקה האם כבר יש זוכה לפרס
  checkIfDrawn(prizeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check/${prizeId}`);
  }

  // קבלת דוח זוכים
  getWinnersReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/winners-report`);
  }

  // קבלת סך הכנסות (לאדמין)
  getTotalIncome(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-income`);
  }
}