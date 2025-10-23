import { QuestionService } from '../question.service';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';

interface User {
  _id: string;
  name: string;
  statusquestion: 'Cho phép đặt câu hỏi' | 'Cấm đặt câu hỏi';
  role?: string;
  img?: string;
}
interface Product {
  _id: string;
  name: string;
  images_main?: string;
}
interface Question {
  replyContent: string;
  _id: string;
  content: string;
  user_id?: User;
  status?: string;
  replyText?: string;
  isReplying?: boolean;
  isVisible?: boolean;
  product_id?: Product;
  productDetails?: {
    _id: string;
    name: string;
    images_main?: string;
  };
  isEditingReply?: boolean;
  editReplyText?: string;
  replyId?: string;
  isReplyVisible?: boolean;
}

@Component({
  selector: 'app-quanlycauhoi',
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
    MatTooltipModule
  ],
  templateUrl: './quanlycauhoi.component.html',
  styleUrls: ['./quanlycauhoi.component.css']
})
export class QuanlycauhoiComponent implements OnInit {
  questions: Question[] = [];
  usersWithQuestions: {
    id: string;
    name: string;
    questionCount: number;
    statusquestion: 'Cho phép đặt câu hỏi' | 'Cấm đặt câu hỏi';
  }[] = [];

  selectedUser: User | null = null;
  selectedUserQuestions: Question[] = [];
  showModal = false;
  imageBaseUrl = environment.apiUrl + '/images/';
  imageUserBaseUrl = environment.apiUrl + '/imagesUsers/';
  searchText: string = '';
  filteredUsersWithQuestions: any[] = [];

  sortOrder: 'az' | 'za' = 'az';

  pageIndex: number = 0;
  pageSize: number = 10;
  pagedUsers: any[] = [];

  replyFormVisible: { [key: string]: boolean } = {};
  editFormVisible: { [key: string]: boolean } = {};
  replyTexts: { [key: string]: string } = {};
  editTexts: { [key: string]: string } = {};

  visibilityFilter: 'all' | 'visible' | 'hidden' = 'all';
  statusFilter: 'all' | 'answered' | 'unanswered' = 'all';
  userStatusFilter: 'all' | 'allowed' | 'banned' = 'all';

  constructor(private questionService: QuestionService, private userService: UserService) { }

  removeVietnameseTones(str: string): string {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  onSortOrderChange() {
    this.sortFilteredUsers();
    this.updatePagedUsers();
  }

  onUserStatusFilterChange() {
    this.filterUsers();
    this.pageIndex = 0;
    this.updatePagedUsers();
  }

  onSearchChange() {
    this.filterUsers();
  }

  filterUsers() {
    const text = this.removeVietnameseTones(this.searchText.trim().toLowerCase());
    this.filteredUsersWithQuestions = this.usersWithQuestions.filter(user => {
      const matchesText =
        this.removeVietnameseTones(user.name.toLowerCase()).includes(text) ||
        user.id.toLowerCase().includes(text);

      let matchesStatus = true;
      if (this.userStatusFilter === 'allowed') {
        matchesStatus = user.statusquestion === 'Cho phép đặt câu hỏi';
      } else if (this.userStatusFilter === 'banned') {
        matchesStatus = user.statusquestion === 'Cấm đặt câu hỏi';
      }
      return matchesText && matchesStatus;
    });
    this.pageIndex = 0;
    this.updatePagedUsers();
  }

  sortFilteredUsers() {
    this.filteredUsersWithQuestions.sort((a, b) => {
      const nameA = this.removeVietnameseTones(a.name.toLowerCase());
      const nameB = this.removeVietnameseTones(b.name.toLowerCase());
      if (this.sortOrder === 'az') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getAllQuestions().subscribe({
      next: (questions: Question[]) => {
        const questionMap = new Map<string, Question>();
        questions.forEach(q => questionMap.set(q._id, q));
        questions.forEach(q => {
          if ((q as any).parent_id) {
            const parent = questionMap.get((q as any).parent_id);
            if (parent) {
              // Chỉ lấy phản hồi của admin
              if (q.user_id && q.user_id.role === 'admin') {
                parent.replyContent = q.content;
                parent.replyId = q._id;
                parent.status = 'Đã trả lời';
                parent.isReplyVisible = q.isVisible;
              }
            }
          }
        });
        this.questions = questions.filter(q => !(q as any).parent_id);
        this.buildUsersWithQuestions();
      }
    });
  }

  buildUsersWithQuestions() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const map = new Map<string, {
          id: string;
          name: string;
          img?: string;
          questionCount: number;
          statusquestion: 'Cho phép đặt câu hỏi' | 'Cấm đặt câu hỏi';
        }>();

        users
          .filter((user: any) => user.role !== 'admin')
          .forEach((user: any) => {
            map.set(user._id, {
              id: user._id,
              name: user.name || 'Ẩn danh',
              img: user.img,
              questionCount: 0,
              statusquestion: user.statusquestion || 'Cho phép đặt câu hỏi'
            });
          });

        this.questions.forEach(q => {
          const userId = q.user_id?._id || 'anonymous';
          if (map.has(userId)) {
            const user = map.get(userId)!;
            user.questionCount++;
          }
        });

        this.usersWithQuestions = Array.from(map.values());
        this.filteredUsersWithQuestions = [...this.usersWithQuestions];
        this.sortFilteredUsers();
        this.pageIndex = 0;
        this.updatePagedUsers();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        Swal.fire('Lỗi', 'Không thể tải dữ liệu người dùng', 'error');
      }
    });
  }

  applyFilters() {
    if (!this.selectedUser) return;
    let filtered = this.questions
      .filter(q => (q.user_id?._id || 'anonymous') === this.selectedUser!._id);

    if (this.visibilityFilter !== 'all') {
      filtered = filtered.filter(q =>
        this.visibilityFilter === 'visible' ? q.isVisible : !q.isVisible
      );
    }
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(q =>
        this.statusFilter === 'answered'
          ? q.status === 'Đã trả lời'
          : q.status === 'Chưa trả lời'
      );
    }
    this.selectedUserQuestions = filtered.sort((a, b) => {
      if (a.isVisible && !b.isVisible) return -1;
      if (!a.isVisible && b.isVisible) return 1;
      if (a.status === 'Chưa trả lời' && b.status !== 'Chưa trả lời') return -1;
      if (a.status !== 'Chưa trả lời' && b.status === 'Chưa trả lời') return 1;
      return 0;
    });
  }

  setVisibilityFilter(filter: 'all' | 'visible' | 'hidden') {
    this.visibilityFilter = filter;
    this.applyFilters();
  }

  setStatusFilter(filter: 'all' | 'answered' | 'unanswered') {
    this.statusFilter = filter;
    this.applyFilters();
  }

  openQuestionsModal(user: { id: string; name: string; statusquestion: 'Cho phép đặt câu hỏi' | 'Cấm đặt câu hỏi' }) {
    this.selectedUser = { _id: user.id, name: user.name, statusquestion: user.statusquestion };
    this.visibilityFilter = 'all';
    this.statusFilter = 'all';
    this.applyFilters();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.selectedUserQuestions = [];
  }

  toggleReplyForm(questionId: string) {
    this.replyFormVisible[questionId] = !this.replyFormVisible[questionId];
  }

  submitReply(q: Question) {
    const replyText = this.replyTexts[q._id];
    if (!replyText?.trim()) {
      Swal.fire('Lưu ý', 'Vui lòng nhập nội dung phản hồi', 'warning');
      return;
    }
    q.isReplying = true;
    const adminId = localStorage.getItem('userId');
    if (!adminId) {
      Swal.fire('Lỗi', 'Không xác định người phản hồi. Vui lòng đăng nhập lại.', 'error');
      q.isReplying = false;
      return;
    }
    this.questionService.createReply({
      content: replyText.trim(),
      product_id: q.product_id?._id || '',
      parent_id: q._id,
      user_id: adminId
    }).subscribe({
      next: (res: any) => {
        q.status = 'Đã trả lời';
        q.replyContent = replyText.trim();
        q.replyId = res._id;
        this.replyTexts[q._id] = '';
        this.replyFormVisible[q._id] = false;
        q.isReplying = false;
        Swal.fire('Thành công', 'Phản hồi đã được gửi. Vui lòng tải lại trang', 'success');
      },
      error: err => {
        q.isReplying = false;
        Swal.fire('Lỗi', 'Không thể gửi phản hồi: ' + (err.message || ''), 'error');
      }
    });
  }

  startEdit(q: Question) {
    this.editFormVisible[q._id] = true;
    this.editTexts[q._id] = q.replyContent || '';
  }

  submitEdit(q: Question) {
    const editText = this.editTexts[q._id];
    if (!editText?.trim()) {
      Swal.fire('Lưu ý', 'Vui lòng nhập nội dung phản hồi', 'warning');
      return;
    }
    q.isReplying = true;
    if (!q.replyId) {
      q.isReplying = false;
      Swal.fire('Lỗi', 'Không tìm thấy replyId để chỉnh sửa.', 'error');
      return;
    }

    this.questionService.editReply({
      replyId: q.replyId,
      content: editText.trim()
    }).subscribe({
      next: () => {
        q.replyContent = editText.trim();
        this.editFormVisible[q._id] = false;
        q.isReplying = false;
        Swal.fire('Thành công', 'Đã cập nhật phản hồi', 'success');
      },
      error: (err) => {
        q.isReplying = false;
        Swal.fire('Lỗi', 'Không thể cập nhật phản hồi: ' + (err.message || ''), 'error');
      }
    });
  }

  cancelEdit(q: Question) {
    this.editFormVisible[q._id] = false;
  }


  
  toggleReplyVisible(question: any) {
    if (!question.replyId) {
      Swal.fire('Lỗi', 'Không tìm thấy phản hồi để cập nhật.', 'error');
      return;
    }
    const newVisible = !question.isReplyVisible;
    this.questionService.toggleVisible(question.replyId, newVisible).subscribe({
      next: () => {
        question.isReplyVisible = newVisible;
        Swal.fire(
          'Thành công',
          `Đã ${newVisible ? 'hiện' : 'ẩn'} phản hồi.`,
          'success'
        );
      },
      error: () => {
        Swal.fire('Lỗi', 'Cập nhật trạng thái phản hồi thất bại!', 'error');
      }
    });
  }

  toggleQuestionStatus(userId: string) {
    const user = this.usersWithQuestions.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.statusquestion === 'Cấm đặt câu hỏi' ? 'Cho phép đặt câu hỏi' : 'Cấm đặt câu hỏi';
    const actionText = newStatus === 'Cấm đặt câu hỏi' ? 'cấm' : 'cho phép';
    const actionColor = newStatus === 'Cấm đặt câu hỏi' ? '#dc3545' : '#198754';

    Swal.fire({
      title: 'Xác nhận thay đổi',
      text: `Bạn có chắc muốn ${actionText} đặt câu hỏi của người dùng này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      confirmButtonColor: actionColor
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateStatusQuestion(userId, newStatus).subscribe({
          next: () => {
            const updatedUser = this.usersWithQuestions.find(u => u.id === userId);
            if (updatedUser) {
              updatedUser.statusquestion = newStatus;
              this.usersWithQuestions = [...this.usersWithQuestions];
            }

            Swal.fire({
              title: 'Thành công',
              text: `Đã ${actionText} đặt câu hỏi thành công`,
              icon: 'success',
              confirmButtonColor: '#198754'
            });
          },
          error: (error) => {
            console.error('Lỗi khi thay đổi trạng thái:', error);
            Swal.fire({
              title: 'Lỗi',
              text: 'Không thể thay đổi trạng thái đặt câu hỏi',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }

  toggleQuestionVisible(question: any) {
    const newVisible = !question.isVisible;
    this.questionService.toggleVisible(question._id, newVisible).subscribe({
      next: () => {
        question.isVisible = newVisible;
        Swal.fire(
          'Thành công',
          `Đã ${newVisible ? 'hiện' : 'ẩn'} câu hỏi.`,
          'success'
        );
      },
      error: () => {
        Swal.fire('Lỗi', 'Cập nhật trạng thái thất bại!', 'error');
      }
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedUsers();
  }

  updatePagedUsers() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.filteredUsersWithQuestions.slice(start, end);
  }

  onAvatarError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/img/default-user.png';
  }
}
