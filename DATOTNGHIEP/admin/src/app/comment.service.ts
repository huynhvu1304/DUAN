import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IComment, IProductComments, IProduct } from './comment.interface';
import { environment } from '../environments/environment'; // <-- Thêm dòng này

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  private productUrl = `${environment.apiUrl}/products`; // Sử dụng environment

  constructor(private http: HttpClient) {}

  // Get product details with images
  getProductDetails(productId: string): Observable<IProduct | null> {
    return this.http.get<IProduct>(`${this.productUrl}/${productId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching product ${productId}:`, error);
        return of(null);
      })
    );
  }

  // Modified getAllComments to include product details
  getAllComments(): Observable<IComment[]> {
    return this.http.get<IComment[]>(this.apiUrl).pipe(
      switchMap(comments => {
        const productIds = [...new Set(comments.map(c => c.product_id._id))];
        const productRequests = productIds.map(id => this.getProductDetails(id));

        return forkJoin(productRequests).pipe(
          map(products => {
            const productMap = new Map(
              products.filter(p => p !== null).map(p => [p!._id, p])
            );

            return comments.map(comment => ({
              ...comment,
              product_id: productMap.get(comment.product_id._id) || comment.product_id
            }));
          })
        );
      })
    );
  }

  // Get comments by product ID
  getCommentsByProduct(productId: string): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.apiUrl}/${productId}`);
  }

  // Add admin reply to comment
  replyToComment(commentId: string, reply: string): Observable<IComment> {
    return this.http.patch<IComment>(`${this.apiUrl}/${commentId}/reply`, { admin_reply: reply });
  }

  // Delete comment
  deleteComment(commentId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${commentId}`);
  }

  // Delete admin reply
  deleteReply(commentId: string): Observable<IComment> {
    return this.http.delete<IComment>(`${this.apiUrl}/${commentId}/reply`);
  }

  // Calculate average rating for a product
  calculateAverageRating(comments: IComment[]): number {
    if (!comments?.length) return 0;
    return comments.reduce((acc, curr) => acc + curr.rating, 0) / comments.length;
  }

  // Group comments by product
 groupCommentsByProduct(comments: IComment[]): IProductComments[] {
  const productMap = new Map<string, IProductComments>();

  comments.forEach(comment => {
    const productId = comment.product_id._id;
    if (!productMap.has(productId)) {
      productMap.set(productId, {
        product: {
          ...comment.product_id,
          images_main: comment.product_id.images_main || ''
        },
        comments: [],        // chứa tất cả bình luận (cả isDeleted true/false)
        commentCount: 0,
        avgRating: 0,
        reviews: []
      });
    }
    const product = productMap.get(productId)!;
    product.comments.push(comment); // lưu tất cả để quản lý
    product.reviews.push(comment);
  });

  return Array.from(productMap.values()).map(product => {
    // Chỉ tính các bình luận không bị ẩn
    const visibleComments = product.comments.filter(c => !c.isDeleted);
    return {
      ...product,
      commentCount: visibleComments.length,
      avgRating: visibleComments.length
        ? this.calculateAverageRating(visibleComments)
        : 0
    };
  });
}

  // Toggle comment status for a user
  toggleCommentStatus(userId: string, newStatus: string): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/${userId}/statuscomment`, {
      statuscomment: newStatus
    });
  }

  // Ẩn/hiện bình luận (isDeleted)
  setCommentVisibility(commentId: string, isDeleted: boolean): Observable<IComment> {
    return this.http.patch<IComment>(`${this.apiUrl}/${commentId}/visibility`, { isDeleted });
  }
}
