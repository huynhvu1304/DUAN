import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder,  Validators } from '@angular/forms';


@Component({
  selector: 'app-dangky',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dangky.component.html',
  styleUrl: './dangky.component.css'
})
export class DangkyComponent {
  formType: 'login' | 'register' = 'login';

  showLoginPassword = false;
  showRegisterPassword = false;

  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  selectedFile: File | null = null;
  submitted = false;
  errorMessage: string | undefined;
  
  //đăng nhập
  loginForm: FormGroup;


  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setFormType(type: 'login' | 'register') {
    this.formType = type;
  }

  toggleLoginPassword() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPassword() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile);
  }

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      console.error('Mật khẩu xác nhận không khớp');
      return;
    }
  
    // Kiểm tra email có phải Gmail không
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(this.user.email)) {
      this.errorMessage = 'Email phải là Gmail!';
      console.error('Email phải là Gmail!');
      return;
    }
  
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    formData.append('confirmPassword', this.user.confirmPassword);
  
    this.userService.postUser(formData).subscribe({
      next: () => {
        console.log('Đăng ký thành công', this.user);
        this.submitted = true;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Đăng ký thất bại');
        this.errorMessage = err?.error?.message || 'Lỗi không xác định';
      }
    });
  }
  

  // đăng nhập
  onLoginSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      const formData:any = this.loginForm.value;

      this.userService.login(formData).subscribe({
        next: (data) => {
          localStorage.setItem('name', data.name);
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
    console.log('Đăng nhập form đang được gửi!');
  }
}
