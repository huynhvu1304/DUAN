import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommentService } from '../comment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'; // Import environment

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() productId!: string;
  comments: any[] = [];
  commentForm!: FormGroup;
  token: string = '';
  userName: string = '';

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    if (!this.token) {
      console.warn('User is not logged in.');
    } else {
      this.fetchUserName();
    }

    if (!this.productId) {
      console.error('Product ID is missing.');
      return;
    }

    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]],
    });

    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && changes['productId'].currentValue) {
      this.loadComments();
    }
  }

  fetchUserName(): void {
    if (!this.token) {
      console.warn('No token found in localStorage.');
      this.userName = 'Ẩn danh';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    // Use environment.apiUrl instead of hard-coded localhost
    this.http.get<{ name: string }>(`${environment.apiUrl}/users/getuser`, { headers }).subscribe(
      (data) => {
        this.userName = data.name || 'Ẩn danh';
      },
      (error) => {
        console.error('Error fetching user information:', error);
        this.userName = 'Ẩn danh';
      }
    );
  }

  loadComments(): void {
    if (!this.productId) {
      console.error('Cannot fetch comments without a productId.');
      return;
    }

    this.commentService.getComments(this.productId).subscribe(
      (data) => {
        this.comments = data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      (error) => {
        console.error('Error fetching comments from server:', error);
      }
    );
  }

  addComment(): void {
    if (!this.token) {
      alert('Bạn cần đăng nhập để bình luận.');
      this.router.navigate(['/dangky']);
      return;
    }

    if (this.commentForm.invalid) {
      alert('Vui lòng nhập nội dung bình luận hợp lệ.');
      return;
    }

    const content = this.commentForm.value.content;
    console.log("Sending comment data:", { productId: this.productId, content, token: this.token });

    if (!this.productId || !content) {
      console.error("Missing required fields: productId or content.");
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
      return;
    }

    this.commentService.addComment(this.productId, content, this.token).subscribe(
      (data) => {
        console.log("Comment added successfully:", data);
        this.commentForm.reset();
        alert('Bình luận của bạn đã được gửi thành công!');
        this.loadComments(); // ✅ Load lại bình luận từ server sau khi gửi thành công
      },
      (error) => {
        console.error("Error adding comment:", error);
        if (error.status === 400) {
          alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra và thử lại.');
        } else if (error.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          this.router.navigate(['/dangky']);
        } else {
          alert('Lỗi khi thêm bình luận. Vui lòng thử lại sau.');
        }
      }
    );
  }

  onSubmit(): void {
    this.addComment();
  }
}
