import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FlashsaleService {
  private apiUrl = `${environment.apiUrl}/flashsales`; 

  constructor(private http: HttpClient) { }

  getAllFlashSales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createFlashSale(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateFlashSale(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteFlashSale(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}