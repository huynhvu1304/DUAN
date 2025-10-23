export interface ProductInterface {
  _id: string;
  name: string;
  description: string;
  images_main: string;
  status: 'active' | 'inactive';
  hot: number;
  created_at: Date;
  updated_at: Date;
  categoryId: string;
  purchases: number;
  brand: string;
}
