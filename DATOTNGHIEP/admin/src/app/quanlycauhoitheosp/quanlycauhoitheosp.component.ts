import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { QuestionService } from '../question.service';
import { environment } from '../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quanlycauhoitheosp',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './quanlycauhoitheosp.component.html',
  styleUrls: ['./quanlycauhoitheosp.component.css']
})
export class QuanlycauhoitheospComponent implements OnInit {
  productsWithQuestions: any[] = [];
  selectedProduct: any = null;
  showModal = false;
  selectedProductQuestions: any[] = [];
  imageBaseUrl = environment.apiUrl + '/images/';
  imageUserBaseUrl = environment.apiUrl + '/imagesUsers/';

  visibilityFilter: 'all' | 'visible' | 'hidden' = 'all';
  statusFilter: 'all' | 'answered' | 'unanswered' = 'all';

  searchText: string = '';
  filteredProductsWithQuestions: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 10;
  pagedProductsWithQuestions: any[] = [];

  // Thêm các biến cho form trả lời/chỉnh sửa
  replyFormVisible: { [key: string]: boolean } = {};
  replyTexts: { [key: string]: string } = {};
  editFormVisible: { [key: string]: boolean } = {};
  editTexts: { [key: string]: string } = {};

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadProductQuestions();
  }

  loadProductQuestions() {
  this.questionService.getQuestionsWithProducts().subscribe({
    next: (data) => {
      this.productsWithQuestions = data.map((item: any) => {
        const questionMap = new Map<string, any>();
        item.questions.forEach((q: any) => questionMap.set(q._id, q));

        // gom reply vào parent
        item.questions.forEach((q: any) => {
          if (q.parent_id) {
            const parent = questionMap.get(q.parent_id);
            if (parent && q.user_id?.role === 'admin') {
              parent.replyContent = q.content;
              parent.replyId = q._id;
              parent.status = 'Đã trả lời';
              parent.isReplyVisible = q.isVisible;
            }
          }
        });

        // Gom tất cả reply của admin cho từng parent
        const adminRepliesMap = new Map<string, any>();
        item.questions.forEach((q: any) => {
          if (q.parent_id && q.user_id?.role === 'admin') {
            // Nếu đã có, lấy reply mới nhất (ưu tiên createdAt, nếu không có thì lấy cuối cùng)
            const current = adminRepliesMap.get(q.parent_id);
            if (!current || (q.createdAt && current.createdAt && new Date(q.createdAt) > new Date(current.createdAt))) {
              adminRepliesMap.set(q.parent_id, q);
            }
            // Nếu không có createdAt, luôn ghi đè (lấy cuối cùng)
            if (!q.createdAt) {
              adminRepliesMap.set(q.parent_id, q);
            }
          }
        });
        // Gán replyContent cho parent
        adminRepliesMap.forEach((reply, parentId) => {
          const parent = questionMap.get(parentId);
          if (parent) {
            parent.replyContent = reply.content;
            parent.replyId = reply._id;
            parent.status = 'Đã trả lời';
            parent.isReplyVisible = reply.isVisible;
          }
        });

        // chỉ giữ lại câu hỏi gốc (không có parent_id)
        const rootQuestions = item.questions.filter((q: any) => !q.parent_id);

        // đếm số lượng câu hỏi
        const visibleQuestions = rootQuestions.filter((q: any) => q.isVisible === true);
        const total = visibleQuestions.length;
        const answered = visibleQuestions.filter((q: any) => q.status === 'Đã trả lời').length;
        const unanswered = visibleQuestions.filter((q: any) => q.status !== 'Đã trả lời').length;
        const hidden = rootQuestions.filter((q: any) => q.isVisible === false).length;

        return {
          ...item,
          questions: rootQuestions, // cập nhật lại
          questionCount: { total, answered, unanswered, hidden }
        };
      });

      // cập nhật modal nếu đang mở
      if (this.showModal && this.selectedProduct) {
        const updated = this.productsWithQuestions.find(
          (item: any) => item.product._id === this.selectedProduct.product._id
        );
        if (updated) {
          this.selectedProduct = updated;
          this.selectedProductQuestions = updated.questions.map((q: any) => ({
            ...q,
            replyText: '',
            isReplying: false,
            isEditingReply: false,
            editReplyText: q.replyContent || '',
            isReplyVisible: q.isReplyVisible ?? true
          })).sort((a: any, b: any) => {
            if (a.status === 'Chưa trả lời' && b.status !== 'Chưa trả lời') return -1;
            if (a.status !== 'Chưa trả lời' && b.status === 'Chưa trả lời') return 1;
            return 0;
          });
        }
      }

      this.filteredProductsWithQuestions = this.productsWithQuestions;
      this.updatePagedProducts();
    },
    error: (err) => {
      Swal.fire('Lỗi', 'Không thể tải dữ liệu: ' + (err.message || ''), 'error');
    }
  });
}


  openQuestionsModal(product: any) {
    this.selectedProduct = product;
    this.visibilityFilter = 'all';
    this.statusFilter = 'all';
    this.applyFilters();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.selectedProductQuestions = [];
  }

  // Hiển thị form trả lời
  toggleReplyForm(questionId: string) {
    this.replyFormVisible[questionId] = !this.replyFormVisible[questionId];
    if (!this.replyFormVisible[questionId]) {
      this.replyTexts[questionId] = '';
    }
  }

  // Gửi phản hồi
  submitReply(question: any) {
    const replyText = this.replyTexts[question._id]?.trim();
    if (!replyText) {
      Swal.fire('Lưu ý', 'Vui lòng nhập nội dung phản hồi', 'warning');
      return;
    }
    question.isReplying = true;
    const adminId = localStorage.getItem('userId');
    if (!adminId) {
      Swal.fire('Lỗi', 'Không xác định người phản hồi. Vui lòng đăng nhập lại.', 'error');
      question.isReplying = false;
      return;
    }
    this.questionService.createReply({
      content: replyText,
      product_id: this.selectedProduct.product._id,
      parent_id: question._id,
      user_id: adminId
    }).subscribe({
      next: () => {
        question.status = 'Đã trả lời';
        this.replyTexts[question._id] = '';
        question.isReplying = false;
        this.replyFormVisible[question._id] = false;
        Swal.fire('Thành công', 'Phản hồi đã được gửi', 'success');
        this.loadProductQuestions();
      },
      error: (err) => {
        question.isReplying = false;
        Swal.fire('Lỗi', 'Không thể gửi phản hồi: ' + (err.message || ''), 'error');
      }
    });
  }

  // Hiển thị form chỉnh sửa
  startEdit(question: any) {
    this.editFormVisible[question._id] = true;
    this.editTexts[question._id] = question.replyContent || '';
  }

  // Gửi chỉnh sửa phản hồi
  submitEdit(question: any) {
    const editText = this.editTexts[question._id]?.trim();
    if (!editText) {
      Swal.fire('Lưu ý', 'Vui lòng nhập nội dung phản hồi', 'warning');
      return;
    }
    question.isReplying = true;
    this.questionService.editReply({
      replyId: question.replyId,
      content: editText
    }).subscribe({
      next: () => {
        this.editFormVisible[question._id] = false;
        question.isReplying = false;
        Swal.fire('Thành công', 'Đã cập nhật phản hồi', 'success');
        this.loadProductQuestions();
      },
      error: (err) => {
        question.isReplying = false;
        Swal.fire('Lỗi', 'Không thể cập nhật phản hồi: ' + (err.message || ''), 'error');
      }
    });
  }

  // Hủy chỉnh sửa
  cancelEdit(question: any) {
    this.editFormVisible[question._id] = false;
    this.editTexts[question._id] = '';
  }

  deleteQuestion(id: string) {
    const userId = localStorage.getItem('userId');
    const isAdmin = true;
    this.questionService.deleteQuestion(id, { user_id: userId || '', isAdmin }).subscribe({
      next: () => {
        this.loadProductQuestions();
        Swal.fire('Đã xóa!', 'Câu hỏi đã được xóa.', 'success');
      },
      error: (error) => {
        Swal.fire('Lỗi', 'Không thể xóa câu hỏi: ' + (error.message || ''), 'error');
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

  setVisibilityFilter(filter: 'all' | 'visible' | 'hidden') {
    this.visibilityFilter = filter;
    this.applyFilters();
  }

  setStatusFilter(filter: 'all' | 'answered' | 'unanswered') {
    this.statusFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    if (!this.selectedProduct) return;

    let filteredQuestions = this.selectedProduct.questions.map((q: any) => ({
      ...q,
      replyText: '',
      isReplying: false,
      isEditingReply: false,
      editReplyText: q.replyContent || ''
    }));

    // Apply visibility filter
    if (this.visibilityFilter !== 'all') {
      filteredQuestions = filteredQuestions.filter((q: any) => 
        this.visibilityFilter === 'visible' ? q.isVisible : !q.isVisible
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filteredQuestions = filteredQuestions.filter((q: any) => 
        this.statusFilter === 'answered' 
          ? q.status === 'Đã trả lời'
          : q.status === 'Chưa trả lời'
      );
    }

    // Sort to prioritize visible questions
    this.selectedProductQuestions = filteredQuestions.sort((a: any, b: any) => {
      if (a.isVisible && !b.isVisible) return -1;
      if (!a.isVisible && b.isVisible) return 1;
      if (a.status === 'Chưa trả lời' && b.status !== 'Chưa trả lời') return -1;
      if (a.status !== 'Chưa trả lời' && b.status === 'Chưa trả lời') return 1;
      return 0;
    });
  }

  removeVietnameseTones(str: string): string {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  onSearchChange() {
    const text = this.removeVietnameseTones(this.searchText.trim().toLowerCase());
    this.filteredProductsWithQuestions = this.productsWithQuestions.filter(item =>
      this.removeVietnameseTones(item.product.name.toLowerCase()).includes(text) ||
      item.product._id.toLowerCase().includes(text)
    );
    this.pageIndex = 0;
    this.updatePagedProducts();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedProducts();
  }

  updatePagedProducts() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProductsWithQuestions = this.filteredProductsWithQuestions.slice(start, end);
  }

  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (img) img.src = '/assets/img/default-user.png';
  }
}
