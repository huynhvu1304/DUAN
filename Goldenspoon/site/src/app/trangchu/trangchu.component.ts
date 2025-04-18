import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../product-interface';
import { ProductService } from '../product.service';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../environments/environment'; // Import environment
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListcardComponent } from '../listcard/listcard.component';

@Component({
  selector: 'app-trangchu',
  imports: [
    CommonModule,     
    FormsModule,      
    RouterModule,     
    ListcardComponent 
  ],
  templateUrl: './trangchu.component.html',
  styleUrls: ['./trangchu.component.css']

  
})
export class TrangchuComponent implements OnInit {
  getMienBac: ProductInterface[] = [];
  getMienTrung: ProductInterface[] = [];
  getMienNam: ProductInterface[] = [];
  getAllPro: ProductInterface[] = [];
  gethot: ProductInterface[] = [];
  keyword: string = '';
  apiUrl: string = environment.apiUrl; // Thêm biến apiUrl từ environment

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getMienBac().subscribe((data) => {
      this.getMienBac = data;
      console.log("hot:", this.getMienBac);
    });

    this.productService.getMienTrung().subscribe((data) => {
      this.getMienTrung = data;
      console.log("hot:", this.getMienTrung);
    });

    this.productService.getMienNam().subscribe((data) => {
      this.getMienNam = data;
      console.log("hot:", this.getMienNam);
    });

    this.productService.getAllPro().subscribe((data) => {
      this.getAllPro = data;
      console.log("all:", this.getAllPro);
    });

    this.productService.getHot().subscribe((data) => {
      this.gethot = data;
      console.log("hot là:", this.gethot);
    });
  }

  onSearch() {
    if (!this.keyword.trim()) {
      return;
    }
    this.router.navigate(['/timkiem'], { 
      queryParams: { ten_mon: this.keyword.trim() } 
    });
  }
}
