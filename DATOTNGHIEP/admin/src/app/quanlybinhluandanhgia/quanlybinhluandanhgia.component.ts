import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommentService } from '../comment.service';
import { IProductComments } from '../comment.interface';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-quanlybinhluandanhgia',
  templateUrl: './quanlybinhluandanhgia.component.html',
  styleUrls: ['./quanlybinhluandanhgia.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ]
})
export class QuanlybinhluandanhgiaComponent implements OnInit {
  displayedColumns = ['stt', 'id', 'product', 'commentCount', 'avgRating', 'actions'];
  dataSource = new MatTableDataSource<IProductComments>();
  loading = false;
  isReviewDetailsOpen = false;
  selectedProduct: IProductComments | null = null;
  // Thêm biến filter
  reviewVisibilityFilter: 'all' | 'visible' | 'hidden' = 'all';
  adminReplyFilter: 'all' | 'replied' | 'unreplied' = 'all';
  selectedCommentId: string = '';
  replyContent: string = '';
  selectedReplyId: string = '';
  editReplyContent: string = '';

  // Thêm biến lưu comments gốc
  originalComments: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  imageBaseUrl = environment.apiUrl + '/images/';
  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.loadComments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  loadComments() {
    this.loading = true;
    this.commentService.getAllComments().subscribe({
      next: (comments) => {
        const groupedComments = this.commentService.groupCommentsByProduct(comments);
        this.dataSource.data = groupedComments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải bình luận:', error);
        this.loading = false;
        Swal.fire('Lỗi', 'Không thể tải dữ liệu bình luận', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filterPredicate = (data: IProductComments, filter: string) => {
      const productName = data.product.name.toLowerCase();
      const productId = data.product._id.toLowerCase();
      return productName.includes(filter) || productId.includes(filter);
    };
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Cập nhật phương thức filterByRating
  filterByRating(rating: number) {
    if (rating === 0) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: IProductComments, filter: string) => {
        return Math.round(data.avgRating) === rating;
      };
      this.dataSource.filter = rating.toString();
    }
  }

  // Cập nhật phương thức filterByCommentCount
  filterByCommentCount(range: number) {
    if (range === 0) {
      this.dataSource.filter = '';
      return;
    }

    const ranges = {
      1: { min: 1, max: 10 },
      2: { min: 10, max: 20 },
      3: { min: 20, max: 50 },
      4: { min: 50, max: 100 }
    };

    this.dataSource.filterPredicate = (data: IProductComments, filter: string) => {
      const count = data.commentCount;
      const selectedRange = ranges[range as keyof typeof ranges];
      return count >= selectedRange.min && count < selectedRange.max;
    };
    this.dataSource.filter = range.toString();
  }

  // Cập nhật phương thức sort
  sort(value: string) {
    const data = [...this.dataSource.data];
    switch (value) {
      case 'ratingAsc':
        data.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
        break;
      case 'ratingDesc':
        data.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'commentAsc':
        data.sort((a, b) => (a.commentCount || 0) - (b.commentCount || 0));
        break;
      case 'commentDesc':
        data.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
      default:
        break;
    }
    this.dataSource.data = data;
  }

  // Cập nhật phương thức openReviewDetails
  openReviewDetails(product: IProductComments) {
    this.selectedProduct = {
      ...product,
      comments: product.comments.map(comment => ({
        ...comment,
        user_id: {
          _id: comment.user_id._id,
          name: comment.user_id.name || 'Người dùng ẩn danh',
          email: comment.user_id.email || 'unknown@example.com',
          password: comment.user_id.password || '',
          img: comment.user_id.img || '',
          role: comment.user_id.role || '',
          status: comment.user_id.status || '',
          created_at: comment.user_id.created_at || new Date(),
          updated_at: comment.user_id.updated_at || new Date(),
          statuscomment: comment.user_id.statuscomment || '',
          statusquestion: comment.user_id.statusquestion || ''
        }
      }))
    };
    // Lưu comments gốc để lọc
    this.originalComments = [...this.selectedProduct.comments];
    this.isReviewDetailsOpen = true;
    this.reviewVisibilityFilter = 'all';
    this.adminReplyFilter = 'all';
    this.applyReviewFilters();
  }

  closeReviewDetails() {
    this.isReviewDetailsOpen = false;
    this.selectedProduct = null;
    this.selectedCommentId = '';
    this.replyContent = '';
  }

  // Thêm phương thức để mở form phản hồi
  openReplyForm(commentId: string) {
    this.selectedCommentId = commentId;
  }

  // Đóng form phản hồi
  closeReplyForm() {
    this.selectedCommentId = '';
    this.replyContent = '';
  }

  // Gửi phản hồi
  submitReply(commentId: string) {
    if (!this.replyContent.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    this.commentService.replyToComment(commentId, this.replyContent).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Đã gửi phản hồi thành công', 'success');
        // Cập nhật UI ngay lập tức, không cần reload lại trang
        if (this.selectedProduct) {
          const comment = this.selectedProduct.comments.find(c => c._id === commentId);
          if (comment) {
            comment.admin_reply = this.replyContent;
          }
        }
        this.closeReplyForm();
      },
      error: (error) => {
        console.error('Lỗi khi gửi phản hồi:', error);
        Swal.fire('Lỗi', 'Không thể gửi phản hồi', 'error');
      }
    });
  }

  // Mở form chỉnh sửa phản hồi
  openEditReplyForm(commentId: string, currentReply: string) {
    this.selectedReplyId = commentId;
    this.editReplyContent = currentReply;
  }

  // Hủy chỉnh sửa
  cancelEdit() {
    this.selectedReplyId = '';
    this.editReplyContent = '';
  }

  // Cập nhật phản hồi
  updateReply(commentId: string) {
    if (!this.editReplyContent.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    this.commentService.replyToComment(commentId, this.editReplyContent).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Đã cập nhật phản hồi thành công', 'success');
        // Cập nhật UI ngay lập tức, không cần reload lại trang
        if (this.selectedProduct) {
          const comment = this.selectedProduct.comments.find(c => c._id === commentId);
          if (comment) {
            comment.admin_reply = this.editReplyContent;
          }
        }
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật phản hồi:', error);
        Swal.fire('Lỗi', 'Không thể cập nhật phản hồi', 'error');
      }
    });
  }


  // Thêm phương thức deleteAdminReply
  toggleReviewDelete(review: any) {
    review.isToggleLoading = true;
    const newIsDeleted = !review.isDeleted;

    this.commentService.setCommentVisibility(review._id, newIsDeleted).subscribe({
      next: () => {
        review.isDeleted = newIsDeleted; // update ngay lập tức
        review.isToggleLoading = false;

        // Update cả originalComments
        const original = this.originalComments.find(r => r._id === review._id);
        if (original) original.isDeleted = newIsDeleted;

        Swal.fire('Thành công', newIsDeleted ? 'Đã ẩn bình luận' : 'Đã hiện bình luận', 'success');

        // Luôn áp dụng filter mới
        this.applyReviewFilters();
      },
      error: () => {
        review.isToggleLoading = false;
        Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
      }
    });
  }

  // Sau khi xóa phản hồi
  deleteAdminReply(commentId: string) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa phản hồi này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteReply(commentId).subscribe({
          next: () => {
            Swal.fire('Thành công', 'Đã xóa phản hồi', 'success');

            // Update ngay lập tức trong modal
            const comment = this.originalComments.find(c => c._id === commentId);
            if (comment) comment.admin_reply = '';

            this.applyReviewFilters(); // áp lại filter để modal luôn mới
          },
          error: (error) => {
            console.error('Lỗi khi xóa phản hồi:', error);
            Swal.fire('Lỗi', 'Không thể xóa phản hồi', 'error');
          }
        });
      }
    });
  }


  setReviewVisibilityFilter(filter: 'all' | 'visible' | 'hidden') {
    this.reviewVisibilityFilter = filter;
    this.applyReviewFilters();
  }

  setAdminReplyFilter(filter: 'all' | 'replied' | 'unreplied') {
    this.adminReplyFilter = filter;
    this.applyReviewFilters();
  }

  // Sửa hàm lọc
  applyReviewFilters() {
    if (!this.selectedProduct) return;

    let filtered = [...this.originalComments];

    // Lọc Ẩn/Hiện
    if (this.reviewVisibilityFilter === 'visible') {
      filtered = filtered.filter(r => !r.isDeleted);
    } else if (this.reviewVisibilityFilter === 'hidden') {
      filtered = filtered.filter(r => r.isDeleted);
    }

    // Lọc phản hồi admin
    if (this.adminReplyFilter === 'replied') {
      filtered = filtered.filter(r => r.admin_reply && r.admin_reply.trim() !== '');
    } else if (this.adminReplyFilter === 'unreplied') {
      filtered = filtered.filter(r => !r.admin_reply || r.admin_reply.trim() === '');
    }

    this.selectedProduct.comments = filtered;
  }

}