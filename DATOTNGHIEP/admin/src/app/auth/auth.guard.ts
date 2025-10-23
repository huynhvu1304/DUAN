import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import jwt_decode from 'jwt-decode'; //  Đúng cách import jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Cắt token để lấy phần payload
        const payloadBase64 = token.split('.')[1]; // phần giữa của JWT
        const payloadDecoded = JSON.parse(atob(payloadBase64)); // Giải mã Base64

        // Kiểm tra quyền truy cập
        if (payloadDecoded.role == 'admin') {
          return true;
        }

      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    // Nếu không có token hoặc không hợp lệ
    this.router.navigate(['/dangnhap']);
    return false;
  }
}
