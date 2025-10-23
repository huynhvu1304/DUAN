import { IUser } from './user.interface';

export interface IComment {
  _id: string;
  content: string;
  rating: number;
  user_id: any;
  product_id: any;
  created_at?: Date;
  updated_at?: Date;
  admin_reply?: string;
  isDeleted?: boolean; // Thêm dòng này
  // ...các trường khác nếu có...
}

export interface IProduct {
  _id: string;
  name: string;
  images_main: string;
}

export interface IProductComments {
  product: IProduct;
  comments: IComment[];
  commentCount: number;
  avgRating: number;
  reviews: IComment[];
}