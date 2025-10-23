import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  saveToken(response: any): void {
    const token = response.token;
    if (token) {
      localStorage.setItem('token', token);

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          localStorage.setItem('userId', payload.id);
        }
      } catch (e) {
        console.error('Không thể giải mã token:', e);
      }
    }
  }

  checkTokenExpiry(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now();
        const exp = payload.exp * 1000;

        if (now > exp) {
          localStorage.removeItem('token');

          Swal.fire({
            icon: 'info',
            title: 'Phiên đăng nhập đã hết hạn',
            text: 'Vui lòng đăng nhập lại!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/dangnhap']);
          });
        }
      } catch (e) {
        console.error('Lỗi kiểm tra token:', e);
        localStorage.removeItem('token');
        this.router.navigate(['/dangnhap']);
      }
    }
  }

  getAllUsers(): Observable<any> {
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  updateUserStatus(userId: string, status: string): Observable<any> {
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.patch(`${this.apiUrl}/${userId}/status`, { status }, { headers });
  }

  updateStatusComment(userId: string, statuscomment: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.patch(
      `${this.apiUrl}/${userId}/statuscomment`, 
      { statuscomment }, 
      { headers }
    );
  }

  updateStatusQuestion(userId: string, statusquestion: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.patch(
      `${this.apiUrl}/${userId}/statusquestion`, 
      { statusquestion }, 
      { headers }
    );
  }
}
