import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrizeService {

  private apiUrl = 'http://localhost:5006/api/Prize'; // כתובת ה-API שלך

  constructor(private http: HttpClient) { }

  // כל הפרסים
  getAllPrizes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // פרס לפי id
  getPrizeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}

