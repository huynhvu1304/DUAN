import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dangnhap.component.html',
  styleUrls: ['./dangnhap.component.css'] // ✅ sửa styleUrl thành styleUrls
})
export class DangnhapComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData:any = this.loginForm.value;

      this.userService.login(formData).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', formData.email);
          localStorage.setItem('role', data.role);
          alert('Đăng nhập thành công!');
          window.location.href = "/";
        },
        error: (err) => {
          alert('Sai email hoặc sai mật khẩu!');
          console.error('Lỗi đăng nhập:', err);
        }
      }); 
    }
  }
}
