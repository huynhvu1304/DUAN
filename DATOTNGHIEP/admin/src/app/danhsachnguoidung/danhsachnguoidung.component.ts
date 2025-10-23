import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2'
import { environment } from '../../environments/environment';
interface User {
  _id: string;
  name: string;
  email: string;
  img: string;
  role: string;
  status: 'hoạt động' | 'đã chặn';
}

@Component({
  selector: 'app-danhsachnguoidung',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    FormsModule, 
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './danhsachnguoidung.component.html',
  styleUrls: ['./danhsachnguoidung.component.css']
})
export class DanhsachnguoidungComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = []; // Thêm mảng để lưu kết quả tìm kiếm
  statusOptions = ['hoạt động', 'đã chặn'];
  updateMessage = '';
  updateError = '';
imageBaseUrl = environment.apiUrl + '/imagesUsers/';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = (data as User[]).filter((user: User) => user.role !== 'admin');
        this.filteredUsers = this.users; // Khởi tạo danh sách lọc ban đầu, đã loại admin
      },
      error: (error) => {
        console.error('Lỗi khi tải người dùng:', error);
      }
    });
  }

  // Thêm hàm tìm kiếm
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    this.filteredUsers = this.users.filter(user =>
      user._id.toLowerCase().includes(filterValue) ||
      user.name.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
  }

  updateStatus(user: User, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    this.userService.updateUserStatus(user._id, newStatus).subscribe({
      next: (response) => {
        user.status = newStatus as 'hoạt động' | 'đã chặn';
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Trạng thái đã được cập nhật thành công',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không cập nhật được trạng thái. Vui lòng thử lại.',
          timer: 2000,
          showConfirmButton: false
        });
        // Khôi phục giá trị chọn về trạng thái ban đầu
        selectElement.value = user.status;
      }
    });
  }
  onImgError(event: any) {
  event.target.src = 'assets/img/default.png';
}

}
