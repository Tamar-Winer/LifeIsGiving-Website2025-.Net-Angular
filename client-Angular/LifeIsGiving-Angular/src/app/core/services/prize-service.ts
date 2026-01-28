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
}
