import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { ProductInterface } from '../product-interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-sanpham3mien',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sanpham3mien.component.html',
  styleUrls: ['./sanpham3mien.component.css']
})
export class Sanpham3mienComponent implements OnInit {
  products: ProductInterface[] = [];
  sortedProduct: ProductInterface[] = [];

  sortOption: string = 'newest';
  cookTimeFilter: string = 'all';
  khauPhanFilter: string = 'all';
  apiUrl: string = environment.apiUrl;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      console.log('Query param categoryId:', categoryId);
  
      if (categoryId) {
        this.productService.getProductsByCategory(categoryId).subscribe(data => {
          console.log('Sản phẩm lọc được:', data);
          this.products = data;
          this.sortedProduct = data;
        });
      }
    });
  }
  

  applyFilters(): void {
    let filtered = [...this.products];

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
      filtered = [...filtered].reverse(); // Giả sử newest là thứ tự cuối
    }

    this.sortedProduct = filtered;
  }

parseTime(timeStr: string): number {
  let minutes = 0;

  // Bắt số tiếng (giờ)
  const hoursMatch = timeStr.match(/(\d+)\s*(tiếng|giờ)/i);
  if (hoursMatch) {
    minutes += parseInt(hoursMatch[1], 10) * 60;
  }

  // Bắt số phút
  const minutesMatch = timeStr.match(/(\d+)\s*(phút)/i);
  if (minutesMatch) {
    minutes += parseInt(minutesMatch[1], 10);
  }

  return minutes;
}

}
