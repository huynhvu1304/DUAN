export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  img: string;
  role: 'admin' | 'user';  // Using union type for specific roles
  status: 'hoạt động' | 'không hoạt động';  // Using union type for status
  created_at: Date;
  updated_at: Date;
  statuscomment: 'Cho phép bình luận' | 'Không cho phép bình luận';  // Assuming this is a string, adjust if it's a different type
  statusquestion: 'Cho phép đặt câu hỏi'| 'Cấm đặt câu hỏi';
}