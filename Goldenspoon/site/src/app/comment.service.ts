import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/environment'; // ✅ Import environment

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`; // Sử dụng apiUrl từ environment

  constructor(private http: HttpClient) {}

  // Lấy danh sách bình luận
  getComments(productId: string): Observable<any[]> {
    if (!productId) {
      throw new Error('Product ID is required to fetch comments.');
    }
    return this.http.get<any[]>(`${this.apiUrl}/${productId}`); // Sử dụng query parameter cho productId
  }

  // Thêm bình luận mới
  addComment(productId: string, content: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, { productId, content }, { headers });
  }
}
