import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from './product-interface'; // Nhớ import interface nếu có
import { CategoryInterface } from './category-interface';
import { Brandinterface } from './brand-interface';
import { Variantinterface } from './variants-interface';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm
  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${this.apiUrl}/products`); // Lấy tất cả sản phẩm từ API
  }

  // Phương thức thêm sản phẩm mới
  addProduct(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage để xác thực
    });
    return this.http.post<ProductInterface[]>(`${this.apiUrl}/products`, formData, { headers });
  }

  // Phương thức cập nhật sản phẩm
  updateProduct(productId: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage để xác thực
    });

    return this.http.patch(`${this.apiUrl}/products/${productId}`, formData, { headers });
  }

  // Phương thức xóa sản phẩm
  deleteProduct(productId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage để xác thực
    });

    return this.http.delete(`${this.apiUrl}/products/${productId}`, { headers });
  }
updatehot(data: { _id: string; hot: number }, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.patch(`${this.apiUrl}/products/hot/${data._id}`, { hot: data.hot }, { headers });
}
// ẩn hiện sản phẩm
updateStatus(productId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage để xác thực
    });
    return this.http.patch(`${this.apiUrl}/products/status/${productId}`, {}, { headers });
}
  // Lấy danh sách danh mục
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`); // Lấy danh sách danh mục từ API
  }
// Thêm danh mục mới
addCategory(formData: FormData): Observable<any>  {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  return this.http.post<CategoryInterface[]>(`${this.apiUrl}/categories`, formData, { headers });
  
}
// Cập nhật danh mục (dùng FormData nếu có hình)
updateCategory(categoryId: string, formData: FormData): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  return this.http.patch(`${this.apiUrl}/categories/${categoryId}`, formData, { headers });
}

checkProductsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products?categoryId=${categoryId}`);
}

// Xóa danh mục
deleteCategory(categoryId: string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  return this.http.delete(`${this.apiUrl}/categories/${categoryId}`, { headers });
}

// Lấy danh sách thương hiệu
  getBrands(): Observable<Brandinterface[]> {
    return this.http.get<Brandinterface[]>(`${this.apiUrl}/brands`); 
  } 

// Thêm thương hiệu mới
  addBrand(formData: FormData): Observable<any> {
      const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  return this.http.post(`${this.apiUrl}/brands`, formData, { headers });
}

// Cập nhật thương hiệu (dùng FormData nếu có hình)
updateBrand(id: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  return this.http.patch(`${this.apiUrl}/brands/${id}`, formData, { headers });
}

checkProductsByBrand(brand: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products?brandId=${brand}`);
  }
// Xóa thương hiệu
deleteBrand(id: string): Observable<any> {
    const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  return this.http.delete(`${this.apiUrl}/brands/${id}`, { headers });
}
 
}

