import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  addComment(productId: string, content: any, token: string) {
    throw new Error('Method not implemented.');
  }
  getComments(productId: string) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
