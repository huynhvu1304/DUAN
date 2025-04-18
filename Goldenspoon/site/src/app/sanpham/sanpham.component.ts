import { Component } from '@angular/core';
import { ProductInterface } from '../product-interface';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CategoryInterface } from '../product-interface';
import { ListcardComponent } from '../listcard/listcard.component';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-sanpham',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule, RouterModule,ListcardComponent],
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent {

  allProduct: ProductInterface[] = [];
  sortedProduct: ProductInterface[] = [];
  categories: CategoryInterface[] = [];
  sortOrder: string = '';
  selectedCategory: string = '';
  keyword: string = '';
  cookTimeFilter: string = 'all';
  khauPhanFilter: string = 'all';
  sortOption: string = 'newest'; // hoặc 'oldest'
  apiUrl: string = environment.apiUrl;
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getAllPro().subscribe((data) => {
      this.allProduct = data;
      this.sortedProduct = [...this.allProduct];
    });

    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  // sortProducts() {
  //   if (this.sortOrder === "asc") {
  //     this.sortedProduct.sort((a, b) => a.price - b.price);
  //   } else if (this.sortOrder === "desc") {
  //     this.sortedProduct.sort((a, b) => b.price - a.price);
  //   } else {
  //     this.sortedProduct = [...this.allProduct];
  //   }
  // }

  filterByCategory() {
    if (this.selectedCategory) {
      this.sortedProduct = this.allProduct.filter(p => p.categoryId === this.selectedCategory);
    } else {
      this.sortedProduct = [...this.allProduct];
    }
  }

  onSearch() {
    if (!this.keyword.trim()) return;
    this.router.navigate(['/timkiem'], { queryParams: { name: this.keyword } });
  }

  applyFilters(): void {
    let filtered = [...this.allProduct];

    // Lọc thời gian nấu
    if (this.cookTimeFilter !== 'all') {
      filtered = filtered.filter(p => {
        const time = this.parseTime(p.cach_lam.thoi_gian_lam);
        if (this.cookTimeFilter === 'short') return time <= 30;
        if (this.cookTimeFilter === 'medium') return time > 30 && time <= 60;
        if (this.cookTimeFilter === 'long') return time > 60;
        return true;
      });
    }

    // Lọc khẩu phần
    if (this.khauPhanFilter !== 'all') {
      filtered = filtered.filter(p => {
        const khauPhan = p.nguyen_lieu.khau_phan.toLowerCase();
        if (this.khauPhanFilter === 'short') return khauPhan.includes('1');
        if (this.khauPhanFilter === 'medium') return khauPhan.includes('2') || khauPhan.includes('3');
        if (this.khauPhanFilter === 'long') return khauPhan.includes('4') || khauPhan.includes('5') || khauPhan.includes('6');
        return true;
      });
    }

    // Sắp xếp
    if (this.sortOption === 'newest') {
      filtered = [...filtered].reverse(); // nếu newest nằm cuối mảng
    } else if (this.sortOption === 'oldest') {
      // giữ nguyên
    }

    this.sortedProduct = filtered;
  }

  parseTime(timeStr: string): number {
    let minutes = 0;

    if (!timeStr) return minutes;

    // Chuẩn hóa chuỗi (xử lý các trường hợp 'Khoảng 30 phút', '30p', '1h', etc.)
    timeStr = timeStr.toLowerCase();

    // Lấy giờ (h, tiếng, giờ)
    const hoursMatch = timeStr.match(/(\d+)\s*(giờ|tiếng|h)/i);
    if (hoursMatch) {
      minutes += parseInt(hoursMatch[1], 10) * 60;
    }

    // Lấy phút (phút, p, ’)
    const minutesMatch = timeStr.match(/(\d+)\s*(phút|p|'|’)/i);
    if (minutesMatch) {
      minutes += parseInt(minutesMatch[1], 10);
    }

    // Trường hợp chuỗi chỉ là số (ví dụ '25') thì coi là phút
    const onlyNumber = timeStr.match(/^(\d+)$/);
    if (onlyNumber) {
      minutes += parseInt(onlyNumber[1], 10);
    }

    return minutes;
  }

}
