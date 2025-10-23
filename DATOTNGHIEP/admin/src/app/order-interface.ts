export interface Order {
  _id: string;
  orderCode?: string; 
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  receiverName?: string;   
  totalAmount?: number;    
  payment?: {
    status: 'unpaid' | 'paid';
    method?: string;
  };
  cancelReason?: string;       
  cancelReasonText?: string;    
}
