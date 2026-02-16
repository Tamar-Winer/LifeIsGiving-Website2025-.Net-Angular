import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}