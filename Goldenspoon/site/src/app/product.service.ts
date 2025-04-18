import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductInterface, CategoryInterface } from './product-interface';
import { environment } from './environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllPro(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products`); // Sử dụng apiUrl từ environment
  }

  getMienBac(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products?idcate=67ebfee2f8d3b2e3ede2ba7d&limit=8`); // Sử dụng apiUrl từ environment
  }

  getMienTrung(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products?idcate=67ed0c710018c91a35113362&limit=8`); // Sử dụng apiUrl từ environment
  }

  getMienNam(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products?idcate=67ed0db10018c91a35113365&limit=8`); // Sử dụng apiUrl từ environment
  }

  getHot(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products?hot=1`); // Sử dụng apiUrl từ environment
  }

  searchProducts(keyword: string): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products?ten_mon=${keyword}`); // Sử dụng apiUrl từ environment
  }

  getprobyid(id: string): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${environment.apiUrl}/products/${id}`); // Sử dụng apiUrl từ environment
  }

  getProductsByCategory(categoryId: string): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products?idcate=${categoryId}`); // Sử dụng apiUrl từ environment
  }

  getCategories(): Observable<CategoryInterface[]> {
    return this.http.get<CategoryInterface[]>(`${environment.apiUrl}/categories`); // Sử dụng apiUrl từ environment
  }
}
