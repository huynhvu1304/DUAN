// src/app/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd, RouterLinkActive } from '@angular/router'; // Đảm bảo RouterLinkActive được import
import { CommonModule } from '@angular/common'; // Để sử dụng *ngIf và [ngClass]
import { FormsModule } from '@angular/forms'; // Để sử dụng [(ngModel)]
import { filter } from 'rxjs/operators'; // Để lọc sự kiện router

@Component({
  selector: 'app-header',
  standalone: true, // Component độc lập
  // Import các module và directive cần thiết
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  // Trạng thái mở/đóng của từng submenu (chỉ các menu CÓ submenu)
  menuStates: { [key: string]: boolean } = {
    products: false,
    comments: false,
    questions: false,
    flashSales: false
  };

  // Trạng thái cho user dropdown (desktop)
  isUserMenuOpen: boolean = false;

  // Trạng thái cho mobile user menu
  isMobileUserMenuOpen: boolean = false;

  // Trạng thái cho sidebar trên mobile (hiện/ẩn)
  isMobileSidebarOpen: boolean = false;

  // Trạng thái cho mini-sidebar (thu gọn/mở rộng trên desktop)
  isMiniSidebar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Đăng ký lắng nghe sự kiện NavigationEnd từ Router
    // để đóng tất cả menu/sidebar khi người dùng điều hướng đến một trang mới
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Đóng tất cả submenu và các dropdown khác
      this.closeAllSubmenus();
      this.isMobileSidebarOpen = false; // Đóng mobile sidebar
      this.isUserMenuOpen = false;      // Đóng user menu
      this.isMobileUserMenuOpen = false; // Đóng mobile user menu

      // Sau khi đóng tất cả, mở submenu tương ứng với URL hiện tại (nếu có)
      this.openCorrespondingSubmenu();
    });

    // Khôi phục trạng thái mini-sidebar từ localStorage khi khởi tạo
    if (localStorage.getItem('screenModeNightTokenState') === 'night') {
      this.isMiniSidebar = true;
    }

    // Mở submenu tương ứng với URL hiện tại khi component khởi tạo lần đầu
    // (quan trọng khi tải lại trang hoặc truy cập trực tiếp URL sâu)
    this.openCorrespondingSubmenu();
  }

  // Hàm xử lý đăng xuất
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
    window.location.reload(); // Tải lại trang để áp dụng thay đổi đăng xuất
  }

  /**
   * Đảo ngược trạng thái mở/đóng của một submenu cụ thể.
   * Đồng thời đóng tất cả các submenu khác để chỉ một menu được mở tại một thời điểm.
   * @param menuName Tên của submenu (ví dụ: 'products', 'comments')
   */
  toggleMenu(menuName: string): void {
    const currentState = this.menuStates[menuName];
    this.closeAllSubmenus(); // Đóng tất cả các menu khác trước
    this.menuStates[menuName] = !currentState; // Sau đó đảo ngược trạng thái của menu hiện tại
  }

  /**
   * Đóng tất cả các submenu con.
   */
  closeAllSubmenus(): void {
    for (const key in this.menuStates) {
      if (this.menuStates.hasOwnProperty(key)) { // Kiểm tra để đảm bảo đó là thuộc tính của đối tượng
        this.menuStates[key] = false;
      }
    }
  }

  /**
   * Mở submenu tương ứng với tuyến đường hiện tại khi tải trang hoặc điều hướng.
   */
  private openCorrespondingSubmenu(): void {
    const currentUrl = this.router.url;

    // Kiểm tra từng submenu để xem tuyến đường hiện tại có thuộc về nó không
    if (currentUrl.startsWith('/danhsachpro') || currentUrl.startsWith('/danhsachdanhmuc') || currentUrl.startsWith('/brand')) {
      this.menuStates['products'] = true;
    } else if (currentUrl.startsWith('/quanlybinhluandanhgia') || currentUrl.startsWith('/quanlybinhluandanhgiatheouser')) {
      this.menuStates['comments'] = true;
    } else if (currentUrl.startsWith('/quanlycauhoitheosp') || currentUrl.startsWith('/quanlycauhoi')) {
      this.menuStates['questions'] = true;
    } else if (currentUrl.startsWith('/quanlykhuyenmai')) {
      this.menuStates['flashSales'] = true;
    }
    // Không cần xử lý các mục không có submenu ở đây
  }

  /**
   * Tắt/mở trạng thái mini-sidebar (thu gọn sidebar) trên desktop.
   */
  toggleMiniSidebar(): void {
    this.isMiniSidebar = !this.isMiniSidebar;
    // Lưu trạng thái vào localStorage để duy trì qua các phiên
    if (this.isMiniSidebar) {
      localStorage.setItem('screenModeNightTokenState', 'night');
    } else {
      localStorage.removeItem('screenModeNightTokenState');
    }
    this.closeAllSubmenus(); // Đóng các submenu khi thu gọn/mở rộng sidebar
  }

  /**
   * Tắt/mở sidebar trên mobile.
   */
  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    if (this.isMobileSidebarOpen) {
      document.documentElement.classList.add('menu-opened'); // Thêm class vào <html> để điều khiển layout tổng thể
    } else {
      document.documentElement.classList.remove('menu-opened'); // Xóa class khỏi <html>
    }
    // Đóng các dropdown và submenu khi mở/đóng mobile sidebar
    this.closeAllSubmenus();
    this.isUserMenuOpen = false;
    this.isMobileUserMenuOpen = false;
  }
}