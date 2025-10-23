import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Có thể xóa nếu không dùng mat-slide-toggle nữa
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { DashboardService, RevenueChartResponse } from '../dashboard.service';
import { AdminOrderService } from '../services/admin-order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatSlideToggleModule, // Vẫn giữ lại nếu bạn có thể muốn sử dụng cho chức năng khác
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [CurrencyPipe, DatePipe, DecimalPipe]
})
export class DashboardComponent implements OnInit {

  totalUsers: number = 0;
  totalProducts: number = 0;
  totalOrders: number = 0;
  totalRevenue: number = 0;
  totalStock: number = 0;
  pendingOrdersCount: number = 0;

  loadingData: boolean = true;
  errorMessage: string | null = null;
  // Chỉ còn 'daily' và 'monthly'
  currentRevenuePeriod: 'daily' | 'monthly' = 'monthly';
  // Đã xóa 'showComparison' và 'revenueChartCompareData'

  revenueChartLabels: string[] = [];
  revenueChartData: number[] = [];
  // Đã xóa revenueChartCompareData

  orderStatusChartData: { value: number, name: string }[] = [];
  topSellingProductsLabels: string[] = [];
  topSellingProductsData: number[] = [];

  revenueChartOptions: any = {
    title: {
      text: 'Doanh thu theo tháng', // Sẽ được cập nhật theo 'period'
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      formatter: (params: any[]) => {
        let tooltipContent = `${params[0].name}<br/>`;
        // Chỉ duyệt qua một tham số vì không còn so sánh
        tooltipContent += `${params[0].marker} ${params[0].seriesName}: ${this.currencyPipe.transform(params[0].value, 'VND', 'symbol', '1.0-0')}<br/>`;
        return tooltipContent;
      }
    },
    legend: {
        bottom: '1%',
        left: 'center',
        data: ['Doanh thu'] // Chỉ còn một mục trong legend
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: this.revenueChartLabels
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: any) => this.currencyPipe.transform(value, 'VND', 'symbol', '1.0-0')
      }
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: 100,
        bottom: 0,
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: 'Doanh thu',
        type: 'line',
        data: this.revenueChartData,
        itemStyle: {
          color: '#5b73e8'
        },
        smooth: true,
        tooltip: {
          valueFormatter: (value: any) => this.currencyPipe.transform(value, 'VND', 'symbol', '1.0-0')
        }
      }
      // Đã xóa series 'Năm trước'
    ]
  };

  orderStatusPieChartOptions: any = {
    title: {
      text: 'Tỷ lệ trạng thái đơn hàng',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} <br/>{c} ({d}%)'
    },
    legend: {
      bottom: '1%',
      left: 'center'
    },
    series: [
      {
        name: 'Trạng thái đơn hàng',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: this.orderStatusChartData
      }
    ]
  };

  topSellingProductsChartOptions: any = {
    title: {
      text: 'Top 5 Sản phẩm bán chạy',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const value = params[0].value;
        return `${params[0].name}: ${this.decimalPipe.transform(value, '1.0-0')} lượt bán`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        formatter: '{value} lượt bán'
      }
    },
    yAxis: {
      type: 'category',
      data: this.topSellingProductsLabels
    },
    series: [
      {
        name: 'Lượt bán',
        type: 'bar',
        data: this.topSellingProductsData,
        itemStyle: {
          color: '#34c38f'
        }
      }
    ]
  };

  displayedColumns: string[] = ['orderId', 'customerName', 'totalAmount', 'status', 'orderDate', 'actions'];
  dataSource: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private adminOrderService: AdminOrderService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.getDashboardData();
    this.getRecentOrdersData();
  }

  getDashboardData(): void {
    this.loadingData = true;
    this.errorMessage = null;

    this.dashboardService.getDashboardOverviewCounts().subscribe({
      next: (data) => {
        this.totalUsers = data.totalUsers;
        this.totalProducts = data.totalProducts;
        this.totalOrders = data.totalOrders;
        this.totalRevenue = data.totalRevenue;
        this.totalStock = data.totalStock;
        this.pendingOrdersCount = data.pendingOrdersCount;
        this.loadingData = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu tổng quan dashboard:', err);
        this.errorMessage = 'Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.';
        this.loadingData = false;
      }
    });

    // Gọi hàm lấy dữ liệu biểu đồ doanh thu mà không có tham số so sánh
    this.getRevenueChart(this.currentRevenuePeriod);

    this.dashboardService.getOrderStatusDistribution().subscribe({
      next: (data) => {
        this.orderStatusChartData = data;
        this.orderStatusPieChartOptions = {
          ...this.orderStatusPieChartOptions,
          series: [{ ...this.orderStatusPieChartOptions.series[0], data: this.orderStatusChartData }]
        };
      },
      error: (err) => console.error('Lỗi khi tải dữ liệu biểu đồ trạng thái đơn hàng:', err)
    });

    this.dashboardService.getTopSellingProductsChartData().subscribe({
      next: (data) => {
        this.topSellingProductsLabels = data.map(item => item._id);
        this.topSellingProductsData = data.map(item => item.totalQuantitySold);

        this.topSellingProductsLabels.reverse();
        this.topSellingProductsData.reverse();

        this.topSellingProductsChartOptions = {
          ...this.topSellingProductsChartOptions,
          yAxis: { data: this.topSellingProductsLabels },
          series: [{ ...this.topSellingProductsChartOptions.series[0], data: this.topSellingProductsData }]
        };
      },
      error: (err) => console.error('Lỗi khi tải dữ liệu biểu đồ top sản phẩm bán chạy:', err)
    });
  }

  // Hàm này không còn tham số 'compare'
  getRevenueChart(period: 'daily' | 'monthly'): void {
    this.currentRevenuePeriod = period;
    // Đã xóa this.showComparison = compare;

    this.dashboardService.getRevenueChartData(period).subscribe({
      next: (data: RevenueChartResponse) => {
        this.revenueChartLabels = data.labels;
        this.revenueChartData = data.data;
        // Đã xóa this.revenueChartCompareData = data.compareData || [];

        this.revenueChartOptions = {
          ...this.revenueChartOptions,
          title: {
            ...this.revenueChartOptions.title,
            text: this.getRevenueChartTitle(period) // Không còn tham số compare
          },
          xAxis: {
            ...this.revenueChartOptions.xAxis,
            data: this.revenueChartLabels
          },
          series: [
            {
              ...this.revenueChartOptions.series[0],
              data: this.revenueChartData,
              type: 'line'
            }
            // Đã xóa series thứ hai
          ],
          legend: {
            ...this.revenueChartOptions.legend,
            data: ['Doanh thu'] // Chỉ còn một mục trong legend
          },
          dataZoom: [
            {
              ...this.revenueChartOptions.dataZoom[0],
              start: 0,
              end: 100
            },
            {
              ...this.revenueChartOptions.dataZoom[1],
              start: 0,
              end: 100
            }
          ]
        };
      },
      error: (err) => console.error(`Lỗi khi tải dữ liệu biểu đồ doanh thu theo ${period}:`, err)
    });
  }

  // Hàm này không còn tham số 'compare'
  private getRevenueChartTitle(period: 'daily' | 'monthly'): string {
    let title = 'Doanh thu ';
    switch (period) {
      case 'daily':
        title += 'theo ngày';
        break;
      case 'monthly':
      default:
        title += 'theo tháng';
        break;
    }
    // Đã xóa logic 'if (compare)'
    return title;
  }

  getRecentOrdersData(): void {
    this.dashboardService.getRecentOrders().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (err) => console.error('Lỗi khi tải dữ liệu đơn hàng gần đây:', err)
    });
  }

  confirmOrder(order: any): void {
    if (order.status !== 'pending') {
      Swal.fire('Thông báo', 'Đơn hàng này không ở trạng thái chờ xác nhận.', 'info');
      return;
    }

    Swal.fire({
      title: 'Xác nhận đơn hàng',
      text: `Bạn có chắc chắn muốn xác nhận đơn hàng ${order._id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminOrderService.updateOrderStatus(order._id, 'confirmed').subscribe({
          next: (res) => {
            Swal.fire('Thành công', 'Đơn hàng đã được xác nhận!', 'success');
            const index = this.dataSource.findIndex(o => o._id === order._id);
            if (index !== -1) {
              this.dataSource[index].status = 'confirmed';
              this.dataSource = [...this.dataSource];
            }
            this.getDashboardData();
          },
          error: (err) => {
            console.error('Lỗi khi xác nhận đơn hàng:', err);
            Swal.fire('Lỗi', err.error?.message || 'Không thể xác nhận đơn hàng.', 'error');
          }
        });
      }
    });
  }
}
