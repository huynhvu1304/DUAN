import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/environment'; // Import đúng từ thư mục environment

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: { type: String, default: "user" };
  favorite: [{ type: String }];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users/register`; // Sử dụng apiUrl từ environment

  constructor(private http: HttpClient) {}

  postUser(user: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  private apiLogin = `${environment.apiUrl}/users/login`; // Sử dụng apiUrl từ environment
  login(user: UserInterface): Observable<any> {
    return this.http.post<any>(this.apiLogin, user);
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users`); // Sử dụng apiUrl từ environment
  }

  addToFavorite(email: string, productId: string): Observable<any> {
    const url = `${environment.apiUrl}/users/${email}/favorite/${productId}`; // Sử dụng apiUrl từ environment
    return this.http.post<any>(url, {});
  }

  checkFavorite(email: string, productId: string): Observable<{ isFavorite: boolean }> {
    return this.http.get<{ isFavorite: boolean }>(
      `${environment.apiUrl}/users/${email}/favorite/${productId}` // Sử dụng apiUrl từ environment
    );
  }
}
