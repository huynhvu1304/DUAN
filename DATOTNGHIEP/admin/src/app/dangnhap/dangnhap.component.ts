import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dangnhap.component.html',
  styleUrls: ['./dangnhap.component.css']
})
export class DangnhapComponent {
  loginForm: FormGroup;
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = "";
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.userService.login(email, password)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (response) => {
  
          this.userService.saveToken(response);

          // Giải mã token để kiểm tra role
           const token = response.token;
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'admin') {
              Swal.fire({
                icon: 'success',
                title: 'Đăng nhập thành công!',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              });
            } else {
              this.errorMessage = "Bạn không có quyền quản trị";
            }
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || "Đăng nhập thất bại, vui lòng thử lại!";
          console.error('Lỗi đăng nhập:', error);
        }
      });
  }
}
