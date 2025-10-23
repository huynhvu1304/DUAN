import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';

import { Router } from '@angular/router';
import { CategoryInterface } from '../category-interface';

// import SweetAlert2
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-danhsachdanhmuc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatCheckboxModule],
  templateUrl: './danhsachdanhmuc.component.html',
  styleUrls: ['./danhsachdanhmuc.component.css']
})
export class DanhsachdanhmucComponent {
  categories: CategoryInterface[] = [];
  dataSource = new MatTableDataSource<CategoryInterface>([]);
  displayedColumns: string[] = ['select', 'name', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  categoryForm!: FormGroup;
  editForm!: FormGroup;
  isAddModalOpen = false;
  isEditModalOpen = false;
  editCategoryId: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.editForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.loadCategories();
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
    this.categoryForm.reset();
  }

  closeModal(): void {
    this.isEditModalOpen = false;
    this.isAddModalOpen = false;
  }

  openEditModal(category: CategoryInterface): void {
    this.editCategoryId = category._id;
    this.isEditModalOpen = true;
    this.editForm.patchValue({
      name: category.name,
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data: CategoryInterface[]) => {
        this.categories = data;
        this.dataSource = new MatTableDataSource(this.categories);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Lỗi khi tải danh mục:', err),
    });
  }
    // Hàm tìm kiếm
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addCategory(): void {
    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name);

    this.productService.addCategory(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thêm danh mục thành công!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.closeModal();
        this.loadCategories();
      },
      error: (err) => {
        console.error('Lỗi khi thêm sản phẩm:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi khi thêm danh mục',
          text: err.message || 'Vui lòng thử lại sau.',
        });
      },
    });
  }

deleteCategory(id: string): void {
  // Bước 1: Gọi hàm kiểm tra sản phẩm
  this.productService.checkProductsByCategory(id).subscribe(
    (products) => {
      if (products && products.length > 0) {
        // Frontend tự xử lý nếu có sản phẩm
        Swal.fire({
          icon: 'warning',
          title: 'Không thể xóa!',
          text: 'Danh mục này đang có sản phẩm liên quan. Vui lòng xóa sản phẩm trước khi xóa danh mục.',
        });
      } else {
        // Bước 2: Gọi hàm xóa nếu không có sản phẩm
        Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa?',
          showCancelButton: true,
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
        }).then((result) => {
          if (result.isConfirmed) {
            this.productService.deleteCategory(id).subscribe({
              next: () => {
                // Xử lý thành công
                Swal.fire('Xóa thành công!', '', 'success');
                this.loadCategories();
              },
              error: (err) => {
                // Bước 3: Frontend xử lý lỗi từ backend
                Swal.fire('Lỗi!', err.error.message || 'Lỗi không xác định.', 'error');
              }
            });
          }
        });
      }
    },
    (error) => {
      // Xử lý lỗi khi không thể kiểm tra sản phẩm
      Swal.fire('Lỗi!', 'Không thể kiểm tra sản phẩm. Vui lòng thử lại.', 'error');
    }
  );
}


  updateCategory(): void {
    const formData = new FormData();
    formData.append('name', this.editForm.value.name);
    this.productService.updateCategory(this.editCategoryId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật danh mục thành công!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.closeModal();
        this.loadCategories();
      },
      error: (err: any) => {
        console.error('Lỗi khi cập nhật danh mục:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi khi cập nhật danh mục',
          text: err.message || 'Vui lòng thử lại sau.',
        });
      }
    });
  }
}
