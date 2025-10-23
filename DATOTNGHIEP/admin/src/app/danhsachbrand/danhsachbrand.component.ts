// danhsachbrand.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-danhsachbrand',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './danhsachbrand.component.html',
  styleUrl: './danhsachbrand.component.css',
})
export class DanhsachbrandComponent {
  brands: any[] = [];
  isAddModalOpen = false;
  isEditModalOpen = false;
  brandForm!: FormGroup;
  editForm!: FormGroup;
  selectedFile: File | null = null;
  editBrandId: string = '';
  isDisabled: boolean = true;
  isFieldDisabled: boolean = true;
  imageBaseUrl = environment.apiUrl + '/images/';
  displayedColumns: string[] = ['stt', 'name', 'image_logo', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      image_logo: [null],
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      image_logo: [null],
    });

    this.loadBrands();
  }

  loadBrands(): void {
    this.productService.getBrands().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openAddModal(): void {
    this.isAddModalOpen = true;
    this.brandForm.reset();
    this.selectedFile = null;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openEditModal(brand: any): void {
    this.isEditModalOpen = true;
    this.editBrandId = brand._id;
    this.editForm.patchValue(brand);
    this.selectedFile = null;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addBrand(): void {
    if (this.brandForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.brandForm.get('name')?.value);
      formData.append('image_logo', this.selectedFile);

      this.productService.addBrand(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Thêm thương hiệu thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.loadBrands();
        this.closeAddModal();
      });
    }
  }

  updateBrand(): void {
    if (this.editForm.valid) {
      const formData = new FormData();
      formData.append('name', this.editForm.get('name')?.value);
      if (this.selectedFile) {
        formData.append('image_logo', this.selectedFile);
      }

      this.productService
        .updateBrand(this.editBrandId, formData)
        .subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thương hiệu thành công!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.loadBrands();
          this.closeEditModal();
        });
    }
  }

deleteBrand(id: string): void {
  // Bước 1: Kiểm tra xem có sản phẩm nào thuộc thương hiệu này không
  this.productService.checkProductsByBrand(id).subscribe({
    next: (products) => {
      if (products && products.length > 0) {
        // Nếu có sản phẩm, hiển thị cảnh báo và không cho xóa
        Swal.fire({
          icon: 'warning',
          title: 'Không thể xóa!',
          text: 'Thương hiệu này đang có sản phẩm liên quan. Vui lòng xóa sản phẩm trước khi xóa thương hiệu.',
          confirmButtonText: 'Đóng',
        });
      } else {
        // Nếu không có sản phẩm, tiến hành xác nhận và xóa
        Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
        }).then((result) => {
          if (result.isConfirmed) {
            // Gọi hàm xóa thương hiệu trong service
            this.productService.deleteBrand(id).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Xóa thương hiệu thành công!',
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.loadBrands(); // Tải lại danh sách thương hiệu
              },
              error: (err) => {
                // 💡 Đã sửa: Xử lý lỗi cụ thể từ backend
                const errorMessage = err.error.message || 'Có lỗi xảy ra khi xóa.';
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi!',
                  text: errorMessage,
                  confirmButtonText: 'Đóng',
                });
              }
            });
          }
        });
      }
    },
    error: (err) => {
      console.error('Lỗi khi kiểm tra sản phẩm:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi kiểm tra sản phẩm. Vui lòng thử lại sau.',
        confirmButtonText: 'Đóng',
      });
    }
  });
}

}