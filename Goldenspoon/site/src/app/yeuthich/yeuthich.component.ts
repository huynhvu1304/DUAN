import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment'; // Import environment

@Component({
  selector: 'app-yeuthich',
  imports: [CommonModule, RouterModule],
  templateUrl: './yeuthich.component.html',
  styleUrls: ['./yeuthich.component.css']
})
export class YeuthichComponent implements OnInit {
  favoriteProducts: any[] = [];
  email = localStorage.getItem('email'); // email user đăng nhập
  environment = environment; 
  constructor(private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    this.http.get(`${environment.apiUrl}/users/${email}/favorites`) // Sử dụng apiUrl từ environment
      .subscribe((res: any) => {
        this.favoriteProducts = res.favoriteProducts;
      });
  }

  removeFromFavorite(productId: string) {
    const email = localStorage.getItem('email'); // hoặc từ service nếu bạn lưu email ở đó
  
    if (!email) {
      alert('Không tìm thấy email người dùng!');
      return;
    }
  
    this.http.delete(`${environment.apiUrl}/users/${email}/favorite/${productId}`) // Sử dụng apiUrl từ environment
      .subscribe({
        next: () => {
          // Sau khi xóa, cập nhật lại danh sách yêu thích
          this.favoriteProducts = this.favoriteProducts.filter(item => item._id !== productId);
        },
        error: (err) => {
          console.error('Lỗi xóa sản phẩm khỏi yêu thích:', err);
          alert('Xóa không thành công!');
        }
      });
  }
}
