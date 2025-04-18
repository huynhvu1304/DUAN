import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-lienhe',
  imports: [CommonModule],
  templateUrl: './lienhe.component.html',
  styleUrl: './lienhe.component.css'
})
export class LienheComponent {
  imgURL = "https://cdn2.tuoitre.vn/zoom/217_136/471584752817336320/2025/3/20/trumptto-174243451955336638444-42-0-1242-1920-crop-17424347270191030016560.png"
  show = false;
  showhide(){
    this.show = !this.show
  }
  gender = "nam";
  isRed = true;
  isBlue = false;
  isGreen = false;
  doimauchu() {
    if (this.isRed) {
      this.isRed = false;
      this.isBlue = true;
    } else if (this.isBlue) {
      this.isBlue = false;
      this.isGreen = true;
    } else if (this.isGreen) {
      this.isGreen = false;
    } else {
      this.isRed = true;
    }
  }
  isDarkMode: boolean = false;

  order = { status: 'Chờ duyệt' }; // Giá trị ví dụ, bạn thay bằng dữ liệu thực tế

  get statusColor(): string {
    switch (this.order.status) {
      case 'Chờ duyệt': return 'orange';
      case 'Đang giao': return 'blue';
      case 'Hoàn thành': return 'green';
      case 'Hủy': return 'red';
      default: return 'black';
    }
  }
  
  

}
