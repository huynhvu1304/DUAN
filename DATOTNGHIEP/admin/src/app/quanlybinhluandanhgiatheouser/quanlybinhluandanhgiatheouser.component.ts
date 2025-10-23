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
import { IComment } from '../comment.interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip'; // Thêm dòng này
import { UserService } from '../user.service'; // Thêm dòng này vào phần import
import { env } from 'echarts';
import { environment } from '../../environments/environment';

interface UserComments {
  user_id: string;
  userName: string;
  commentCount: number;
  comments: IComment[];
  statuscomment: 'Cho phép bình luận' | 'Cấm bình luận';
}

@Component({
  selector: 'app-quanlybinhluandanhgiatheouser',
  templateUrl: './quanlybinhluandanhgiatheouser.component.html',
  styleUrls: ['./quanlybinhluandanhgiatheouser.component.css'],
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
    FormsModule,
    MatTooltipModule  // Thêm dòng này
  ]
})
export class QuanlybinhluandanhgiatheouserComponent implements OnInit {
  displayedColumns = ['stt', 'user_id', 'userName', 'commentCount', 'actions'];
  dataSource = new MatTableDataSource<UserComments>();
  loading = false;
  isDetailsOpen = false;
  selectedUser: UserComments | null = null;
  imageBaseUrl = environment.apiUrl + '/images/';
  // Thêm các property mới
  selectedCommentId: string = '';
  replyContent: string = '';
  selectedReplyId: string = '';
  editReplyContent: string = '';

  reviewVisibilityFilter: 'all' | 'visible' | 'hidden' = 'all';
  adminReplyFilter: 'all' | 'replied' | 'unreplied' = 'all';
  originalComments: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private commentService: CommentService,
    private userService: UserService // Thêm dòng này
  ) {}

  ngOnInit() {
    this.loadUserComments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUserComments() {
    this.loading = true;
    // Lấy danh sách users từ UserService
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.commentService.getAllComments().subscribe({
          next: (comments) => {
            const userMap = new Map<string, UserComments>();
            
            // Tạo map từ tất cả users trước
            interface IUser {
              _id: string;
              name?: string;
              statuscomment?: 'Cho phép bình luận' | 'Cấm bình luận';
            }

            const usersTyped: IUser[] = users;

            usersTyped.forEach((user: IUser) => {
              userMap.set(user._id, {
                user_id: user._id,
                userName: user.name || 'Người dùng ẩn danh',
                commentCount: 0,
                comments: [],
                statuscomment: user.statuscomment || 'Cho phép bình luận'
              } as UserComments);
            });

            // Thêm comments vào users tương ứng
            comments.forEach(comment => {
              const userId = comment.user_id._id;
              if (userMap.has(userId)) {
                const userComments = userMap.get(userId)!;
                userComments.commentCount++;
                userComments.comments.push(comment);
              }
            });

            this.dataSource.data = Array.from(userMap.values());
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading comments:', error);
            this.loading = false;
            Swal.fire('Lỗi', 'Không thể tải dữ liệu bình luận', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
        Swal.fire('Lỗi', 'Không thể tải dữ liệu người dùng', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openUserDetails(user: UserComments) {
    this.selectedUser = {
      ...user,
      comments: user.comments.map(comment => ({ ...comment }))
    };
    this.isDetailsOpen = true;
    this.originalComments = [...user.comments];
    this.reviewVisibilityFilter = 'all';
    this.adminReplyFilter = 'all';
    this.applyReviewFilters();
  }

  closeDetails() {
    this.isDetailsOpen = false;
    this.selectedUser = null;
  }

  submitReply(commentId: string) {
    if (!this.replyContent.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    this.commentService.replyToComment(commentId, this.replyContent).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Đã gửi phản hồi thành công', 'success');
        // Cập nhật UI trực tiếp
        const comment = this.originalComments.find(c => c._id === commentId);
        if (comment) comment.admin_reply = this.replyContent;
        this.applyReviewFilters();
        this.closeReplyForm();
      },
      error: (error) => {
        console.error('Lỗi khi gửi phản hồi:', error);
        Swal.fire('Lỗi', 'Không thể gửi phản hồi', 'error');
      }
    });
  }

  openEditReplyForm(commentId: string, currentReply: string) {
    this.selectedReplyId = commentId;
    this.editReplyContent = currentReply;
  }

  cancelEdit() {
    this.selectedReplyId = '';
    this.editReplyContent = '';
  }

  updateReply(commentId: string) {
    if (!this.editReplyContent.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    this.commentService.replyToComment(commentId, this.editReplyContent).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Đã cập nhật phản hồi thành công', 'success');
        // Cập nhật UI trực tiếp
        const comment = this.originalComments.find(c => c._id === commentId);
        if (comment) comment.admin_reply = this.editReplyContent;
        this.applyReviewFilters();
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật phản hồi:', error);
        Swal.fire('Lỗi', 'Không thể cập nhật phản hồi', 'error');
      }
    });
  }

  deleteComment(commentId: string) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa bình luận này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            Swal.fire('Thành công', 'Đã xóa bình luận', 'success');
            // Xóa trực tiếp trên UI
            this.originalComments = this.originalComments.filter(c => c._id !== commentId);
            this.applyReviewFilters();
          },
          error: (error) => {
            console.error('Lỗi khi xóa bình luận:', error);
            Swal.fire('Lỗi', 'Không thể xóa bình luận', 'error');
          }
        });
      }
    });
  }

  // Thêm các phương thức mới
  openReplyForm(commentId: string) {
    this.selectedCommentId = commentId;
  }

  closeReplyForm() {
    this.selectedCommentId = '';
    this.replyContent = '';
  }

  toggleCommentStatus(userId: string) {
    const user = this.dataSource.data.find(u => u.user_id === userId);
    if (!user) return;

    const newStatus = user.statuscomment === 'Cấm bình luận' ? 'Cho phép bình luận' : 'Cấm bình luận';
    const actionText = newStatus === 'Cấm bình luận' ? 'cấm' : 'cho phép';
    const actionColor = newStatus === 'Cấm bình luận' ? '#dc3545' : '#198754';

    Swal.fire({
      title: 'Xác nhận thay đổi',
      text: `Bạn có chắc muốn ${actionText} bình luận của người dùng này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      confirmButtonColor: actionColor
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateStatusComment(userId, newStatus).subscribe({
          next: (response) => {
            // Cập nhật trạng thái trong dataSource
            const updatedUser = this.dataSource.data.find(u => u.user_id === userId);
            if (updatedUser) {
              updatedUser.statuscomment = newStatus;
              // Tạo một bản sao mới của mảng data để trigger change detection
              this.dataSource.data = [...this.dataSource.data];
            }

            // Load lại dữ liệu từ server
            this.loadUserComments();

            Swal.fire({
              title: 'Thành công',
              text: `Đã ${actionText} bình luận thành công`,
              icon: 'success',
              confirmButtonColor: '#198754'
            });
          },
          error: (error) => {
            console.error('Lỗi khi thay đổi trạng thái:', error);
            Swal.fire({
              title: 'Lỗi',
              text: 'Không thể thay đổi trạng thái bình luận',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }

  // Ẩn/hiện bình luận
  toggleReviewDelete(comment: any) {
    comment.isToggleLoading = true;
    const newIsDeleted = !comment.isDeleted;
    this.commentService.setCommentVisibility(comment._id, newIsDeleted).subscribe({
      next: () => {
        comment.isDeleted = newIsDeleted;
        comment.isToggleLoading = false;
        const original = this.originalComments.find(r => r._id === comment._id);
        if (original) original.isDeleted = newIsDeleted;
        Swal.fire('Thành công', newIsDeleted ? 'Đã ẩn bình luận' : 'Đã hiện bình luận', 'success');
        this.applyReviewFilters();
      },
      error: () => {
        comment.isToggleLoading = false;
        Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
      }
    });
  }

  // Xóa phản hồi admin
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
            const comment = this.originalComments.find(c => c._id === commentId);
            if (comment) comment.admin_reply = '';
            this.applyReviewFilters();
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

  applyReviewFilters() {
    if (!this.selectedUser) return;
    let filtered = [...this.originalComments];
    if (this.reviewVisibilityFilter === 'visible') {
      filtered = filtered.filter(r => !r.isDeleted);
    } else if (this.reviewVisibilityFilter === 'hidden') {
      filtered = filtered.filter(r => r.isDeleted);
    }
    if (this.adminReplyFilter === 'replied') {
      filtered = filtered.filter(r => r.admin_reply && r.admin_reply.trim() !== '');
    } else if (this.adminReplyFilter === 'unreplied') {
      filtered = filtered.filter(r => !r.admin_reply || r.admin_reply.trim() === '');
    }
    this.selectedUser.comments = filtered;
  }
}
