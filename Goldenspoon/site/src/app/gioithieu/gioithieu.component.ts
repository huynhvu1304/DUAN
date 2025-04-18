import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gioithieu',
  imports: [FormsModule],
  templateUrl: './gioithieu.component.html',
  styleUrl: './gioithieu.component.css'
})
export class GioithieuComponent {
  name = "Vũ Cake";
  imgURL = "https://cdn2.tuoitre.vn/zoom/217_136/471584752817336320/2025/3/20/trumptto-174243451955336638444-42-0-1242-1920-crop-17424347270191030016560.png"
  
  thongbao(){
    alert("banj ddax nhaans vaof nuts ddos");
      this.imgURL = "https://cdn2.tuoitre.vn/zoom/217_136/471584752817336320/2025/3/20/qh2-17401955904991461963926-95-0-1658-2500-crop-17424515642001578558876-265-237-1250-1813-crop-174245342425591591751.jpg"
  }
  email:string="";
  choose:string="";
}
