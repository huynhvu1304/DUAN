import { Component } from '@angular/core';
import { ListcardComponent } from '../listcard/listcard.component';
import { ProductInterface } from '../product-interface';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timkiem',
  imports: [ListcardComponent,CommonModule],
  templateUrl: './timkiem.component.html',
  styleUrl: './timkiem.component.css'
})
export class TimkiemComponent {
  searchPro: ProductInterface[] = [];
  noResults: boolean = false; // Thêm biến để kiểm tra không có kết quả

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}  

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.productService.searchProducts(params['ten_mon']).subscribe((data) => {
        this.searchPro = data;
        this.noResults = this.searchPro.length === 0; // Kiểm tra nếu mảng rỗng
      });
    });
  }
}