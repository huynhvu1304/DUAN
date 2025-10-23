import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 

export interface Question {
  _id: string;
  content: string;
  user_id?: {
    _id: string;
    name: string;
  };
  product_id?: string | {
    _id: string;
    name: string;
    images_main?: string;
  };
  status: string;
  created_at: string;
}

export interface Product {
  _id: string;
  name: string;
  images_main: string;
}

export interface QuestionData {
  product: Product;
  questionCount: {
    total: number;
    answered: number;
    unanswered: number;
  };
  questions: Question[];
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getQuestionsWithProducts(): Observable<QuestionData[]> {
    return this.http.get<QuestionData[]>(`${this.apiUrl}/with-products`);
  }

  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  deleteQuestion(questionId: string, body: { user_id: string, isAdmin: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${questionId}`, { body });
  }


  replyToQuestion(id: string, user_id: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/answer`, { user_id, content });
  }
    // Trong question.service.ts
  updateUserStatusQuestion(userId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${userId}/statusquestion`, { statusquestion: status });
  }

  createReply(data: { content: string; product_id: string; parent_id: string; user_id: string }) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  editReply(data: { replyId: string; content: string }) {
    return this.http.put(`${this.apiUrl}/edit-reply`, data);
  }

  toggleVisible(questionId: string, isVisible: boolean) {
    return this.http.patch(`${this.apiUrl}/${questionId}/visible`, { isVisible });
  }
  
}
