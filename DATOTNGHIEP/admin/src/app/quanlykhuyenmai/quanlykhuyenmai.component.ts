import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlashsaleService } from '../flashsale.service';
import { ProductService } from '../product.service'; // Thêm import
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment'; 
export interface ProductVariant {
  _id: string;
  id: string;
  image: string;
  cost_price: number;
  sale_price: number;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  images_main: string;
  status: string;
  hot: number;
  created_at: string;
  updated_at: string;
  categoryId: {
    _id: string;
    name: string;
  };
  brand: string | { _id: string; name?: string };
  updatedAt: string;
  __v: number;
  purchases: number;
  variants: ProductVariant[];
}

@Component({
  selector: 'app-quanlykhuyenmai',
  imports: [CommonModule, FormsModule],
  templateUrl: './quanlykhuyenmai.component.html',
  styleUrl: './quanlykhuyenmai.component.css',
})
export class QuanlykhuyenmaiComponent implements OnInit {
  todayString: string = '';
  // ...existing code...
  public apiUrl = environment.apiUrl; 
  getProductById(variantId: string) {
    if (!variantId) return undefined;
    // So sánh _id dưới dạng string để tránh lỗi object vs string
    return this.sanPhamList.find(
      (sp) => sp._id?.toString() === variantId?.toString()
    );
  }
  getVariantById(variantId: string) {
    return this.sanPhamList.find((sp) => sp._id === variantId);
  }
  isModalOpen = false;
  isEdit = false;
  flashSales: any[] = [];
  currentEditId: string | null = null;
  isProductModalOpen = false;
  productSearch = '';

  sanPhamList: any[] = []; // Bỏ hardcode, để mảng rỗng

  form: {
    name: string;
    products: { product_id: string; variant_id: string; quantity: number }[];
    discount_value: number;
    start_time: string;
    end_time: string;
  } = {
    name: '',
    products: [],
    discount_value: 0,
    start_time: '',
    end_time: '',
  };

  categoryList: { _id: string; name: string }[] = [];
  brandList: { _id: string; name: string }[] = [];
  filterCategory: string = '';
  filterBrand: string = '';
  filterPriceMin: number | null = null;
  filterPriceMax: number | null = null;
  filterStockMin: number | null = null;

  // Thêm biến để lưu các variant nhập số lượng không hợp lệ
  invalidQuantityVariants: string[] = [];

  constructor(
    private flashsaleService: FlashsaleService,
    private productService: ProductService // Inject ProductService
  ) {}

  ngOnInit() {
    // Lấy ngày hôm nay dạng yyyy-MM-ddTHH:mm
    const today = new Date();
    this.todayString = today.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    this.loadFlashSales();
    // this.loadProducts();
  }

  // Hàm lấy sản phẩm từ API
  loadProducts() {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.sanPhamList = data.flatMap((product: Product) =>
        (product.variants || []).map((variant: ProductVariant) => ({
          ...variant,
          product_id: product._id,
          productName: product.name,
          images_main: product.images_main,
          brand: typeof product.brand === 'object' && product.brand?._id ? product.brand._id : product.brand, // Sửa dòng này
        }))
      );
    });
  }

  loadFlashSales() {
    this.flashsaleService.getAllFlashSales().subscribe((data: any) => {
      // Nếu API trả về object chứa mảng, ví dụ { flashSales: [...] }
      if (data && Array.isArray(data)) {
        this.flashSales = data;
      } else if (data && Array.isArray((data as any).flashSales)) {
        this.flashSales = (data as any).flashSales;
      } else {
        this.flashSales = [];
      }
    });
  }

  loadCategory() {
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categoryList = data;
    });
  }

  loadBrand() {
    this.productService.getBrands().subscribe((data: any[]) => {
      this.brandList = data;
    });
  }

  openCreateModal() {
    this.isModalOpen = true;
    this.isEdit = false;
    this.currentEditId = null;
    this.form = {
      name: '',
      products: [],
      discount_value: 0,
      start_time: '',
      end_time: '',
    };
  }

  openEditModal(fs: any) {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.sanPhamList = data.flatMap((product: Product) =>
        (product.variants || []).map((variant: ProductVariant) => ({
          ...variant,
          product_id: product._id,
          productName: product.name,
          images_main: product.images_main,
          brand: product.brand,
        }))
      );
      this.isModalOpen = true;
      this.isEdit = true;
      this.currentEditId = fs._id;
      this.form = {
        name: fs.name,
        products: fs.products.map((p: any) => ({
          product_id: (p.product_id && p.product_id._id
            ? p.product_id._id
            : p.product_id
          )?.toString(),
          variant_id: p.variant_id,
          quantity: p.quantity,
        })),
        discount_value: fs.discount_value,
        start_time: this.formatLocalDatetime(fs.start_time),
        end_time: this.formatLocalDatetime(fs.end_time),
      };
      // ...existing code...
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

 saveKhuyenMai() {
  // Kiểm tra ngày bắt đầu và kết thúc
  const start = new Date(this.form.start_time);
  const end = new Date(this.form.end_time);
  if (start > end) {
    Swal.fire({
      icon: 'warning',
      title: 'Lỗi ngày tháng',
      text: 'Ngày bắt đầu không được sau ngày kết thúc!',
      confirmButtonText: 'OK',
    });
    return;
  }

  if (
    !this.form.name ||
    !this.form.products.length ||
    !this.form.discount_value ||
    !this.form.start_time ||
    !this.form.end_time
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu thông tin',
      text: 'Vui lòng nhập đầy đủ thông tin khuyến mãi!',
      confirmButtonText: 'OK',
    });
    return;
  }

  const handleError = (err: any) => {
    const errorMessage = err?.error?.message || 'Lỗi không xác định!';
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: errorMessage,
    });
  };

  if (!this.isEdit) {
    // Tạo mới
    this.flashsaleService.createFlashSale(this.form).subscribe({
      next: () => {
        this.loadFlashSales();
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Tạo chương trình thành công!',
          timer: 1200,
          showConfirmButton: false,
        });
      },
      error: handleError
    });
  } else if (this.currentEditId) {
    // Sửa
    this.flashsaleService
      .updateFlashSale(this.currentEditId, this.form)
      .subscribe({
        next: () => {
          this.loadFlashSales();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!',
            timer: 1200,
            showConfirmButton: false,
          });
        },
        error: handleError
      });
  }
}


  editKhuyenMai(fs: any) {
    this.openEditModal(fs);
  }

  deleteKhuyenMai(id: string) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xoá?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.flashsaleService.deleteFlashSale(id).subscribe(() => {
          this.loadFlashSales();
          Swal.fire({
            icon: 'success',
            title: 'Đã xoá!',
            showConfirmButton: false,
            timer: 1200,
          });
        });
      }
    });
  }

  getTotalQuantity(products: any[]): number {
    if (!products) return 0;
    return products.reduce((total, p) => total + (p.quantity || 0), 0);
  }

  filteredSanPhamList() {
    let list = this.sanPhamList;

    if (this.productSearch) {
      const search = this.productSearch.toLowerCase();
      list = list.filter(
        (sp) =>
          sp.productName.toLowerCase().includes(search) ||
          sp.size?.toString().includes(search) ||
          sp.color?.toLowerCase().includes(search)
      );
    }

    if (this.filterBrand) {
      list = list.filter((sp) => sp.brand === this.filterBrand);
    }

    if (this.filterPriceMin != null) {
      list = list.filter((sp) => sp.cost_price >= this.filterPriceMin!);
    }
    if (this.filterPriceMax != null) {
      list = list.filter((sp) => sp.cost_price <= this.filterPriceMax!);
    }
    if (this.filterStockMin != null) {
      list = list.filter((sp) => sp.stock >= this.filterStockMin!);
    }

    return list;
  }

  getProductName(variantId: string) {
    const found = this.sanPhamList.find((sp) => sp._id == variantId); // dùng ==
    if (!found) return '';
    return `${found.productName} - Size: ${found.size} - Màu: ${found.color}`;
  }

  // Sửa lại các hàm checkbox, quantity để dùng variant _id
  isProductChecked(variantId: string): boolean {
    return this.form.products.some((p: any) => p.variant_id === variantId);
  }

  onProductCheckboxChange(event: any, variantId: string) {
    const variant = this.sanPhamList.find((sp) => sp._id === variantId);
    if (!variant) return;
    if (event.target.checked) {
      this.form.products.push({
        product_id: variant.product_id, // id sản phẩm cha
        variant_id: variantId, // id variant
        quantity: 1,
      });
    } else {
      this.form.products = this.form.products.filter(
        (p: any) => p.variant_id !== variantId
      );
    }
  }

  getProductQuantity(variantId: string): number {
    const found = this.form.products.find(
      (p: any) => p.variant_id === variantId
    );
    return found ? found.quantity : 1;
  }

  setProductQuantity(variantId: string, value: number) {
    const found = this.form.products.find(
      (p: any) => p.variant_id === variantId
    );
    if (found) {
      let num = Number(value);
      if (isNaN(num) || num < 1) {
        if (!this.invalidQuantityVariants.includes(variantId)) {
          this.invalidQuantityVariants.push(variantId);
        }
        num = 1;
      } else {
        // Nếu hợp lệ thì loại khỏi danh sách lỗi
        this.invalidQuantityVariants = this.invalidQuantityVariants.filter(
          (id) => id !== variantId
        );
      }
      const variant = this.sanPhamList.find((sp) => sp._id === variantId);
      let max = variant ? variant.stock : 999999;
      if (num > max) num = max;
      found.quantity = num;
    }
  }

  onQuantityBlur(variantId: string) {
    const found = this.form.products.find(
      (p: any) => p.variant_id === variantId
    );
    if (found && (found.quantity == null || found.quantity < 1)) {
      found.quantity = 1;
      if (!this.invalidQuantityVariants.includes(variantId)) {
        this.invalidQuantityVariants.push(variantId);
      }
      // Force update UI
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          `input[data-variant='${variantId}']`
        );
        if (input) input.value = '1';
      });
    } else {
      // Nếu hợp lệ thì loại khỏi danh sách lỗi
      this.invalidQuantityVariants = this.invalidQuantityVariants.filter(
        (id) => id !== variantId
      );
    }
  }

  openProductModal() {
    this.loadProducts();
    this.loadBrand(); // gọi lấy brand thay vì category
    this.isProductModalOpen = true;
  }

  closeProductModal() {
    // Kiểm tra tất cả sản phẩm đã chọn
    const invalid = this.form.products.some(
      (p) => !p.quantity || p.quantity < 1
    );
    if (invalid || this.invalidQuantityVariants.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Thêm không thành công. Vui lòng kiểm tra số lượng sản phẩm!',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.isProductModalOpen = false;
  }

  removeProductFromForm(variantId: string) {
    this.form.products = this.form.products.filter(
      (p) => p.variant_id !== variantId
    );
  }

  formatLocalDatetime(dt: string): string {
    if (!dt) return '';
    const date = new Date(dt);
    // Lấy các thành phần local
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }

  onStartDateChange(): void {
  if (this.form.start_time && this.form.end_time) {
    const startDate = new Date(this.form.start_time);
    const endDate = new Date(this.form.end_time);

    // Nếu endDate trước hoặc bằng startDate, reset endDate về rỗng
    if (endDate <= startDate) {
      this.form.end_time = '';
    }
  }
}
}
