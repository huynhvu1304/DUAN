import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2';
import { EditorModule } from '@tinymce/tinymce-angular';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-danhsachpro',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    EditorModule],
  templateUrl: './danhsachpro.component.html',
  styleUrl: './danhsachpro.component.css'
})
export class DanhsachproComponent {
  // Danh sách sản phẩm, danh mục, thương hiệu
  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  // Quản lý ảnh xem trước
  productImagePreview: string | ArrayBuffer | null = null;
  variantImagePreviews: (string | ArrayBuffer | null)[] = [];
  // Quản lý modal
  isAddModalOpen = false;
  isEditModalOpen = false;
  isDetailModalOpen = false;
  selectedProduct: any = null;
 // Form chính
  productForm!: FormGroup;
  editForm!: FormGroup;
  // Ảnh chính sản phẩm và biến thể
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;
  editImagePreview: string | null = null;
  editVariantImagePreviews: (string | null)[] = [];
  editVariantFiles: (File | null)[] = [];
  // ID sản phẩm đang chỉnh sửa
  editProductId: string = '';
    // ViewChild quản lý input ảnh
  @ViewChild('mainImageInput') mainImageInput!: any;
  @ViewChildren('variantImageInput') variantImageInputs!: any;
  imageBaseUrl = environment.apiUrl + '/images/';
// MatTable
  displayedColumns: string[] = [
    'stt',
    'image',
    'name',
    'category',
    'brand',
    'price',
    'hot',
    'purchases',
    'actions',
    'status',
  ];
  private allDisplayedColumns: string[] = [
    'stt',
    'image',
    'name',
    'category',
    'brand',
    'price',
    'hot',
    'purchases',
    'actions',
    'status',
  ];
  private mobileDisplayedColumns: string[] = [
    'stt',
    'image',
    'name',
    'price',
    'actions',
    'status',
  ]; // Các cột hiển thị trên mobile
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private productService: ProductService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Khởi tạo form thêm sản phẩm
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      brandId: ['', Validators.required],
      variants: this.fb.array([]),
    });

    // Khởi tạo form sửa sản phẩm
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      brandId: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      variants: this.fb.array([]),
    });

    this.loadBrands();
    this.loadProducts();
    this.loadCategories();
    this.checkScreenWidth(); // Gọi khi khởi tạo để thiết lập cột ban đầu
  }
    @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth(); // Gọi mỗi khi kích thước cửa sổ thay đổi
  }
   checkScreenWidth(): void {
    if (window.innerWidth < 768) { // Ví dụ: màn hình dưới 768px là mobile
      this.displayedColumns = this.mobileDisplayedColumns;
    } else {
      this.displayedColumns = this.allDisplayedColumns;
    }
    // Cần refresh datasource để bảng cập nhật các cột mới
    if (this.dataSource) {
        this.dataSource._updateChangeSubscription();
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Tùy chỉnh sorting cho các cột đặc biệt
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'category': return item.categoryId?.name || '';
        case 'brand': return item.brand?.name || '';
        case 'price': return this.getPriceRange(item);
        default: return item[property] || '';
      }
    };

    // Tùy chỉnh filtering
    this.dataSource.filterPredicate = (data, filter: string) => {
      const searchText = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(searchText) ||
        data.categoryId?.name.toLowerCase().includes(searchText) ||
        data.brand?.name.toLowerCase().includes(searchText)
      );
    };
  }
  // Lọc dữ liệu
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
        // Validator kiểm tra sale_price < cost_price
  priceValidator(control: AbstractControl): ValidationErrors | null {
    const costPrice = control.get('cost_price')?.value;
    const salePrice = control.get('sale_price')?.value;

    if (costPrice != null && salePrice != null && salePrice >= costPrice) {
      return { invalidPrice: 'Giá giảm phải nhỏ hơn giá gốc' };
    }
    return null;
  }



// Tải danh sách sản phẩm
loadProducts(): void {
  this.productService.getProducts().subscribe({
    next: (data) => {
      // Sắp xếp dữ liệu theo trường _id giảm dần để sản phẩm mới nhất lên đầu
      this.products = data.sort((a: any, b: any) => {
        if (a._id > b._id) {
          return -1; // Đặt a trước b
        }
        if (a._id < b._id) {
          return 1; // Đặt b trước a
        }
        return 0; // Giữ nguyên vị trí
      });
      this.dataSource.data = this.products;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Lỗi khi tải sản phẩm:', err)
  });
}

// Tải danh sách danh mục
  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi khi tải danh mục:', err)
    });
  }

// Tải danh sách thương hiệu
  loadBrands(): void {
    this.productService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi lấy danh sách brand:', err)
    });
  }

  // Lấy FormArray của variant
  // Thao tác với variants của form sửa
  get editVariants(): FormArray {
    return this.editForm.get('variants') as FormArray;
  }

  // Thao tác với variants của form thêm
  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  get variantControls() {
    return (this.productForm.get('variants') as FormArray)?.controls || [];
  }
  
 //Mở / Đóng modal
  // Mở modal thêm sản phẩm
  openAddModal(): void {
    this.isAddModalOpen = true;
    this.productForm.reset();
    this.variants.clear();
    this.selectedFile = null;
    this.productImagePreview = null;
    this.variantImagePreviews = [];
    if (this.mainImageInput) {
      this.mainImageInput.nativeElement.value = '';
    }
  }
// Mở modal sửa sản phẩm và đổ dữ liệu vào form
  openEditModal(product: any): void {
    this.isEditModalOpen = true;
    this.editProductId = product._id;
    this.selectedEditFile = null;
    this.editImagePreview = product.images_main ? `${this.imageBaseUrl}${product.images_main}` : null;

    this.editForm.patchValue({
      name: product.name,
      brandId: product.brand._id,
      categoryId: product.categoryId._id,
      description: product.description,
    });

    this.editVariants.clear();
    this.editVariantImagePreviews = [];
    this.editVariantFiles = [];

    product.variants.forEach((variant: any) => {
      this.editVariants.push(this.fb.group({
        _id: [variant._id],
        size: [variant.size, Validators.required],
        color: [variant.color, Validators.required],
        cost_price: [variant.cost_price, [Validators.required, Validators.min(0)]],
        sale_price: [variant.sale_price, [Validators.required, Validators.min(0)]],
        stock: [variant.stock, [Validators.required, Validators.min(0)]],
        image: [null]
      }, { validators: this.priceValidator })); // Áp dụng validator

      this.editVariantImagePreviews.push(variant.image ? `${this.imageBaseUrl}${variant.image}` : null);
      this.editVariantFiles.push(null);
    });

    console.log('editVariantImagePreviews:', this.editVariantImagePreviews);
  }

  // Mở modal chi tiết sản phẩm
  openDetailModal(product: any): void {
    this.selectedProduct = product;
    this.isDetailModalOpen = true;
  }
  // Đóng modal
  closeModal(): void {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDetailModalOpen = false;
    this.selectedProduct = null;

    this.selectedEditFile = null;
    this.editImagePreview = null;
    this.editVariantFiles = [];

    this.productImagePreview = null;
    this.variantImagePreviews = [];

    if (this.mainImageInput) {
      this.mainImageInput.nativeElement.value = '';
    }
    if (this.variantImageInputs) {
      this.variantImageInputs.forEach((input: any) => {
        input.nativeElement.value = '';
      });
    }
  }

  

  // Thêm sản phẩm
  addProduct(): void {
if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng nhập đầy đủ và đúng thông tin! Giá giảm phải nhỏ hơn giá gốc.',
        confirmButtonText: 'OK'
      });
      return;
    }


    const formData = new FormData();
    const formValue = this.productForm.value;
    formData.append('name', formValue.name);
    formData.append('categoryId', formValue.categoryId);
    formData.append('description', formValue.description);
    formData.append('brandId', formValue.brandId);
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    const variantsData = formValue.variants.map((v: any) => ({
      size: v.size,
      color: v.color,
      cost_price: v.cost_price,
      sale_price: v.sale_price,
      stock: v.stock
    }));
    formData.append('variants', JSON.stringify(variantsData));

    formValue.variants.forEach((v: any, index: number) => {
      if (v.image) {
        formData.append('variantImages', v.image);
      }
    });

    this.productService.addProduct(formData).subscribe({
      next: () => {
      Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm sản phẩm thành công!',
          confirmButtonText: 'OK'
        });
        this.closeModal();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Lỗi khi thêm sản phẩm:', err);
 Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: `Thêm sản phẩm thất bại: ${err.error?.message || 'Vui lòng kiểm tra console'}`,
          confirmButtonText: 'OK'
        });

      },
    });
  }
// Thêm variant
  addVariant(): void {
    this.variants.push(this.fb.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      cost_price: [0, [Validators.required, Validators.min(0)]],
      sale_price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: [null]
    }, { validators: this.priceValidator })); // Áp dụng validator
    this.variantImagePreviews.push(null);
  }
  // Cập nhật sản phẩm
  updateProduct(): void {
if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng nhập đầy đủ và đúng thông tin! Giá giảm phải nhỏ hơn giá gốc.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editForm.value.name);
    formData.append('brand', this.editForm.value.brandId);
    formData.append('categoryId', this.editForm.value.categoryId);
    formData.append('description', this.editForm.value.description);

    if (this.selectedEditFile) {
      formData.append('img', this.selectedEditFile);
    }

    const variantsData = this.editVariants.value.map((v: any) => ({
      _id: v._id || null,
      size: v.size,
      color: v.color,
      cost_price: v.cost_price,
      sale_price: v.sale_price,
      stock: v.stock,
    }));
    formData.append('variants', JSON.stringify(variantsData));

this.editVariantFiles.forEach((file, index) => {
  if (file) {
    // Gửi tên field ảnh là variantImages[index]
    formData.append(`variantImages_${index}`, file);
  }
});


    // Log dữ liệu gửi lên
    for (let pair of (formData as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    this.productService.updateProduct(this.editProductId, formData).subscribe({
      next: (updatedProduct: any) => {
       Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật sản phẩm thành công!',
          confirmButtonText: 'OK'
        });
        if (updatedProduct?.product?.images_main) {
          this.editImagePreview = `${this.imageBaseUrl}${updatedProduct.product.images_main}`;
        }
        this.closeModal();
        this.loadProducts();
      },
      error: (err) => {
       Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: `Cập nhật sản phẩm thất bại: ${err.error?.message || 'Vui lòng kiểm tra console'}`,
          confirmButtonText: 'OK'
        });
      },
    });
  }

addEditVariant(): void {
  this.editVariants.push(this.fb.group({
    size: ['', Validators.required],
    color: ['', Validators.required],
    cost_price: [0, [Validators.required, Validators.min(0)]],
    sale_price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    image: [null]
  }, { validators: this.priceValidator }));

  this.editVariantImagePreviews.push(null);     // Push ảnh preview trống cho biến thể mới
  this.editVariantFiles.push(null);             // Push file trống cho biến thể mới
}

  removeEditVariant(index: number): void {
  this.editVariants.removeAt(index);
  this.editVariantImagePreviews.splice(index, 1);
  this.editVariantFiles.splice(index, 1);
}
  // Chọn file ảnh chính
  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productImagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
// Chọn ảnh chính khi sửa
  onEditFileSelect(event: any): void {
    this.selectedEditFile = event.target.files[0];
    if (this.selectedEditFile) {
      const reader = new FileReader();
      reader.onload = () => {
        
        this.editImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedEditFile);
    }
  }
   // Chọn ảnh variant khi thêm
  onVariantImageSelect(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.variants.at(index).get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.variantImagePreviews[index] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Chọn ảnh variant khi sửa
  onEditVariantImageSelect(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.editVariantFiles[index] = file;
      this.editVariants.at(index).get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.editVariantImagePreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  // Xóa ảnh chính
  removeMainImage(): void {
    this.selectedFile = null;
    this.productImagePreview = null;
    if (this.mainImageInput) {
      this.mainImageInput.nativeElement.value = '';
    }
  }
  // Xóa ảnh chính khi sửa
  removeEditMainImage(): void {
  this.selectedEditFile = null;
  this.editImagePreview = null;
  const inputEl = document.getElementById('editImg') as HTMLInputElement;
  if (inputEl) inputEl.value = '';
}

    // Xóa ảnh variant
  removeVariantImage(index: number): void {
    this.variants.at(index).get('image')?.setValue(null);
    this.variantImagePreviews[index] = null;
    const inputEl = this.variantImageInputs?.toArray()[index]?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  
    // Xóa variant
  removeVariant(index: number): void {
    this.variants.removeAt(index);
    this.variantImagePreviews.splice(index, 1);
    const inputEl = this.variantImageInputs?.toArray()[index]?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  // Xóa sản phẩm
  deleteProduct(productId: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa sản phẩm này không?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Xóa sản phẩm thành công!',
              confirmButtonText: 'OK'
            });
            this.loadProducts();
          },
          error: (err) => {
            console.error('Lỗi khi xóa sản phẩm:', err);
            Swal.fire({
              icon: 'error',
              title: 'Thất bại',
              text: 'Không thể xóa sản phẩm. Vui lòng thử lại!',
              confirmButtonText: 'OK'
            });
          },
        });
      }
    });
  }

toggleStatus(product: any) {
  const confirmText = product.status === 'active' 
    ? 'Bạn có chắc muốn ẨN sản phẩm này?' 
    : 'Bạn có chắc muốn Hiển THị sản phẩm này?';

  Swal.fire({
    title: 'Xác nhận',
    text: confirmText,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy',
  }).then((result) => {
    if (result.isConfirmed) {
      this.productService.updateStatus(product._id).subscribe({
        next: (res: any) => {
          product.status = res.status; // cập nhật lại status trong UI
          Swal.fire('Thành công', res.message, 'success');
        },
        error: () => {
          Swal.fire('Lỗi', 'Đã có lỗi xảy ra!', 'error');
        }
      });
    }
  });
}

  // Cập nhật hot
  toggleHot(product: any): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const updatedHotStatus = product.hot === 1 ? 0 : 1;
    this.productService.updatehot({ _id: product._id, hot: updatedHotStatus }, token).subscribe({
      next: (res) => {
        console.log('Hot status updated', res);
        product.hot = updatedHotStatus;
      },
      error: (err) => console.error('Error updating hot status', err),
    });
  }

  // Hiển thị giá từ nhỏ đến lớn
  getPriceRange(product: any): string {
    if (!product.variants || product.variants.length === 0) return 'Không có giá';

    const prices = product.variants.map((variant: any) => variant.cost_price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const formattedMin = minPrice.toLocaleString('vi-VN');
    const formattedMax = maxPrice.toLocaleString('vi-VN');

    return minPrice === maxPrice ? `${formattedMin} ` : `${formattedMin} - ${formattedMax} `;
  }

  // Sắp xếp variants theo màu và size
  get sortedVariantsByColorAndSize() {
    if (!this.selectedProduct?.variants) return [];

    const groups: { [color: string]: any[] } = {};
    this.selectedProduct.variants.forEach((v: any) => {
      if (!groups[v.color]) {
        groups[v.color] = [];
      }
      groups[v.color].push(v);
    });

    Object.keys(groups).forEach(color => {
      groups[color].sort((a, b) => Number(a.size) - Number(b.size));
    });

    const sortedVariants = [];
    for (const color of Object.keys(groups)) {
      sortedVariants.push(...groups[color]);
    }

    return sortedVariants;
  }


}