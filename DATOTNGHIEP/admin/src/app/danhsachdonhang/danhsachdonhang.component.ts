import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminOrderService } from '../services/admin-order.service'; 
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment'; 

@Component({
  selector: 'app-danhsachdonhang',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './danhsachdonhang.component.html',
  styleUrls: ['./danhsachdonhang.component.css'],
  providers: [CurrencyPipe, DatePipe, DecimalPipe]
})
export class DanhsachdonhangComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  selectedOrderId: string = '';
  currentPage: number = 1;
  ordersPerPage: number = 10;

  currentStep: number = 1;
  totalSteps: number = 4; 

  totalRevenue: number = 0; 

  // Base URL cho hình ảnh từ environment
  imageBaseUrl = environment.apiUrl + '/images/';

  // Trong component quản lý đơn hàng admin
  isCancelModalOpen = false;
  cancelReasonText = '';

  constructor(
    private orderService: AdminOrderService,
    private route: ActivatedRoute,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.loadRevenue();
    this.loadOrders();

    // Lắng nghe query params để xử lý trường hợp mở chi tiết đơn hàng từ URL
    this.route.queryParams.subscribe(params => {
      const statusFilter = params['status'];
      if (statusFilter) {
        this.filterStatus = statusFilter;
      }
      this.checkQueryParamsForOrderDetails();
    });
  }

  // Tải tổng doanh thu
  loadRevenue(): void {
    this.orderService.getRevenue().subscribe({
      next: (res) => {
        this.totalRevenue = res.totalRevenue;
      },
      error: (err: any) => { 
        console.error('Lỗi khi lấy doanh thu:', err);
      }
    });
  }

  // Tải danh sách đơn hàng
  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res: { orders: any[] }) => { 
        this.orders = res.orders;
        this.checkQueryParamsForOrderDetails();
      },
      error: (err: any) => { 
        console.error('Lỗi khi lấy đơn hàng:', err);
        Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng.', 'error');
      }
    });
  }

  // Kiểm tra query params để hiển thị chi tiết đơn hàng
  private checkQueryParamsForOrderDetails(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId && this.orders.length > 0) {
      const foundOrder = this.orders.find(order => order._id === orderId);
      if (foundOrder) {
        this.openDetail(foundOrder);
        this.router.navigate([], {
          queryParams: { orderId: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      } else {
        // Nếu không tìm thấy trong danh sách đã tải, gọi API để lấy chi tiết
        this.orderService.getOrderDetail(orderId).subscribe({
          next: (orderDetail: any) => { 
            if (orderDetail) {
              this.openDetail(orderDetail);
              this.router.navigate([], {
                queryParams: { orderId: null },
                queryParamsHandling: 'merge',
                replaceUrl: true
              });
            } else {
              Swal.fire('Không tìm thấy', 'Không tìm thấy đơn hàng với ID này.', 'info');
            }
          },
          error: (err: any) => { 
            console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
            Swal.fire('Lỗi', 'Không thể tải chi tiết đơn hàng.', 'error');
          }
        });
      }
    }
  }

  // Mở modal chi tiết đơn hàng
  openDetail(order: any) {
    this.selectedOrder = order;
    console.log('selectedOrder:', this.selectedOrder); 
    // Thiết lập bước hiện tại của tiến trình dựa trên trạng thái đơn hàng
    switch (order.status) {
      case 'pending': this.currentStep = 1; break;
      case 'confirmed': this.currentStep = 2; break;
      case 'shipping': this.currentStep = 3; break;
      case 'delivered': this.currentStep = 4; break;
      case 'cancelled': this.currentStep = 0; break; 
      default: this.currentStep = 1;
    }
  }

  // Đóng modal chi tiết đơn hàng
  closeDetail() {
    this.selectedOrder = null;
    // Xóa orderId khỏi URL khi đóng modal
    this.router.navigate([], {
      queryParams: { orderId: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  // Lấy trạng thái tiếp theo cho việc chuyển trạng thái
  getNextStatus(step: number): string | null {
    switch (step) {
      case 1: return 'confirmed';
      case 2: return 'shipping';
      case 3: return 'delivered';
      default: return null;
    }
  }

  // Chuyển trạng thái đơn hàng sang bước tiếp theo
  nextStep() {
    if (!this.selectedOrder || this.selectedOrder.status === 'cancelled' || this.currentStep >= 4) return;

    const nextStatus = this.getNextStatus(this.currentStep);
    if (!nextStatus) return;

    Swal.fire({
      title: 'Xác nhận chuyển trạng thái',
      text: 'Bạn có muốn chuyển trạng thái đơn hàng này không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Chuyển',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.updateOrderStatus(this.selectedOrder._id, nextStatus).subscribe({
          next: (res: any) => { 
            this.selectedOrder.status = nextStatus;
            this.currentStep++;
            Swal.fire('Thành công', 'Trạng thái đơn hàng đã được cập nhật!', 'success');
            this.loadOrders(); 
          },
          error: (err: any) => { 
            console.error('Lỗi cập nhật trạng thái:', err);
            Swal.fire('Lỗi', err.error?.message || 'Không thể cập nhật trạng thái đơn hàng.', 'error');
          }
        });
      }
      // Nếu bấm Hủy thì không làm gì cả
    });
  }

  // Các biến để lọc đơn hàng
  filterStatus: string = '';
  filterPayment: string = '';
  filterDateFrom: string = '';
  filterDateTo: string = '';
  searchText: string = '';
  debounceTimeout: any = null;
  debouncedSearchText: string = ''; 

  onSearchTextChange(value: string) {
    this.searchText = value;
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      this.debouncedSearchText = value;
      this.currentPage = 1;
    }, 300); 
  }

  // Sửa lại filteredOrders dùng debouncedSearchText
  get filteredOrders() {
    return this.orders.filter(order => {
      // Lọc theo trạng thái
      if (this.filterStatus && order.status !== this.filterStatus) return false;

      // Lọc theo trạng thái thanh toán
      if (this.filterPayment) {
        if (this.filterPayment === 'paid' && order.payment?.status !== 'paid') return false;
        if (this.filterPayment === 'unpaid' && order.payment?.status !== 'unpaid') return false;
      }

      // Lọc theo ngày đặt từ
      if (this.filterDateFrom) {
        const from = new Date(this.filterDateFrom);
        from.setHours(0, 0, 0, 0); 
        const orderDate = new Date(order.createdAt);
        if (orderDate < from) return false;
      }

      // Lọc theo ngày đặt đến
      if (this.filterDateTo) {
        const to = new Date(this.filterDateTo);
        to.setHours(23, 59, 59, 999); 
        const orderDate = new Date(order.createdAt);
        if (orderDate > to) return false;
      }

      // Lọc theo searchText (tên người nhận, mã đơn hàng, hoặc orderCode)
      if (this.debouncedSearchText) {
        const keyword = this.debouncedSearchText.trim().toLowerCase();
        const receiverName = (order.receiverName || order.userId?.name || '').toLowerCase();
        const orderId = (order._id || '').toLowerCase();
        const orderCode = (order.orderCode || '').toLowerCase();
        if (
          !receiverName.includes(keyword) &&
          !orderId.includes(keyword) &&
          !orderCode.includes(keyword)
        ) return false;
      }

      return true;
    });
  }

  // Getter để tính tổng doanh thu (chỉ đơn hàng đã thanh toán)
  getTotalRevenue(): number {
    return this.orders
      .filter(order => order?.payment?.status === 'paid')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }

  // Getter để lấy danh sách đơn hàng cho trang hiện tại
  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.ordersPerPage;
    const end = start + this.ordersPerPage;
    return this.filteredOrders.slice(start, end);
  }

  // Getter để tính tổng số trang
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.ordersPerPage);
  }

  // Thay đổi trang hiện tại
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Chuyển đổi trạng thái tiếng Anh sang tiếng Việt
  getVietnameseStatus(status: string): string {
    if (status === 'pending') return 'Đang chờ xác nhận';
    if (status === 'confirmed') return 'Đã xác nhận';
    if (status === 'shipping') return 'Đang giao hàng';
    if (status === 'delivered') return 'Đã giao';
    if (status === 'cancelled') return 'Đã hủy';
    return status;
  }

  // Chuyển đổi phương thức thanh toán tiếng Anh sang tiếng Việt
  getPaymentMethod(method: string): string {
    if (method === 'cod') return 'Thanh toán khi nhận hàng';
    if (method === 'vnpay') return 'VNPAY';
    return method;
  }

  // Chuyển đổi trạng thái thanh toán tiếng Anh sang tiếng Việt
  getPaymentStatus(status: string, order?: any): string {
    if (status === 'unpaid' || status === 'failed') return 'Chưa thanh toán';
    if (status === 'refunded') return 'Đã hủy thanh toán';
    if (status === 'paid') return 'Đã thanh toán';
    // Nếu là pending và đơn hàng đã bị hủy với VNPAY thì trả về "Đã hủy giao dịch"
    if (
      status === 'pending' &&
      order?.payment?.method === 'vnpay' &&
      order?.status === 'cancelled'
    ) return 'Đã hủy giao dịch';
    return 'Chưa thanh toán';
  }

  // Tính chiều rộng của thanh tiến trình trong modal
  getProgressWidth(): string {
    // 4 bước (1->4), có 3 khoảng cách giữa các bước, nên widths tương ứng là 0%, 33.3%, 66.6%, 100%
    const widths: string[] = ['0%', '33.3%', '66.6%', '100%'];
    if (this.selectedOrder?.status === 'cancelled') return '0%'; 
    // currentStep là 1-4, tương ứng index 0-3 trong widths (trừ cái 0%)
    const stepIndex = Math.max(0, Math.min(this.currentStep - 1, 3));
    return widths[stepIndex];
  }

  // Xác nhận cập nhật trạng thái thanh toán
  confirmPaymentUpdate(order: any) {
    Swal.fire({
      title: 'Xác nhận thanh toán',
      text: 'Bạn chắc chắn đơn này đã được thanh toán?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đã thanh toán',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.updatePaymentStatus(order._id, 'paid').subscribe({
          next: (res: any) => {
            Swal.fire('Thành công', 'Đã cập nhật trạng thái!', 'success');

            // Cập nhật trạng thái thanh toán trong selectedOrder nếu đang hiển thị modal
            if (this.selectedOrder && this.selectedOrder._id === order._id) {
              this.selectedOrder.payment.status = 'paid';
            }
            // Cập nhật trạng thái trong danh sách orders để hiển thị lên bảng
            order.payment.status = 'paid';
            this.loadRevenue(); 
            this.loadOrders(); 
          },
          error: (err: any) => {
            console.error('Lỗi khi cập nhật thanh toán:', err);
            Swal.fire('Lỗi', err.error?.message || 'Không thể cập nhật thanh toán', 'error');
          }
        });
      }
    });
  }

  // Xác nhận hủy đơn hàng bởi Admin
  // confirmAdminCancelOrder(orderId: string): void {
  //   Swal.fire({
  //     title: 'Xác nhận hủy đơn hàng (Admin)',
  //     text: 'Bạn có chắc chắn muốn hủy đơn hàng này? Việc này sẽ hoàn lại tồn kho và giảm lượt mua!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Đồng ý hủy',
  //     cancelButtonText: 'Không',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Sửa dòng này: truyền thêm lý do hủy (chuỗi rỗng nếu không nhập)
  //       this.orderService.adminCancelOrder(orderId, '').subscribe({
  //         next: (res: any) => {
  //           Swal.fire('Thành công', res.message || 'Đơn hàng đã được hủy bởi Admin.', 'success');
  //           this.loadOrders(); 
  //           if (this.selectedOrder && this.selectedOrder._id === orderId) {
  //             this.closeDetail(); 
  //           }
  //         },
  //         error: (err: any) => {
  //           console.error('Lỗi khi Admin hủy đơn hàng:', err);
  //           Swal.fire('Lỗi', err.error?.message || 'Không thể hủy đơn hàng.', 'error');
  //         }
  //       });
  //     }
  //   });
  // }

  getCancelReasonLabel(reason: string): string {
    switch (reason) {
      case 'changed_mind': return 'Khách đổi ý, không muốn mua nữa';
      case 'ordered_wrong': return 'Khách đặt nhầm sản phẩm/size/số lượng';
      case 'found_cheaper': return 'Khách tìm được sản phẩm giá rẻ hơn';
      case 'other': return 'Lý do khác';
      default: return 'Không rõ';
    }
  }

  openCancelModal(orderId: string) {
    this.selectedOrderId = orderId;
    this.cancelReasonText = '';
    this.isCancelModalOpen = true;
  }

  closeCancelModal() {
    this.isCancelModalOpen = false;
    this.cancelReasonText = '';
    this.selectedOrderId = '';
  }

  submitCancelOrder() {
    if (!this.cancelReasonText.trim()) {
      // Nếu chưa nhập lý do thì báo lỗi
      Swal.fire('Vui lòng nhập lý do hủy đơn!', '', 'warning');
      return;
    }
    this.orderService.adminCancelOrder(this.selectedOrderId, this.cancelReasonText).subscribe({
      next: (res: any) => {
        Swal.fire('Thành công', res.message || 'Đã hủy đơn hàng.', 'success');
        this.isCancelModalOpen = false;
        this.loadOrders();
        if (this.selectedOrder && this.selectedOrder._id === this.selectedOrderId) {
          this.closeDetail();
        }
      },
      error: (err: any) => {
        Swal.fire('Lỗi', err.error?.message || 'Không thể hủy đơn hàng.', 'error');
      }
    });
  }

  copyOrderCode(orderCode: string) {
    if (!orderCode) return;
    navigator.clipboard.writeText(orderCode).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã sao chép mã đơn hàng!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    });
  }
}