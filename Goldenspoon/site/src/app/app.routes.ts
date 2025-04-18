import { Routes } from '@angular/router';
import { TrangchuComponent } from './trangchu/trangchu.component';
import { GioithieuComponent } from './gioithieu/gioithieu.component';
import { SanphamComponent } from './sanpham/sanpham.component';
import { LienheComponent } from './lienhe/lienhe.component';
import { TimkiemComponent } from './timkiem/timkiem.component';
import { ChitietsanphamComponent } from './chitietsanpham/chitietsanpham.component';
import { GiohangComponent } from './giohang/giohang.component';
import { DangkyComponent } from './dangky/dangky.component';
import { YeuthichComponent } from './yeuthich/yeuthich.component';
import { Sanpham3mienComponent } from './sanpham3mien/sanpham3mien.component';
import { CommentComponent } from './comment/comment.component';
import { DangnhapComponent } from './dangnhap/dangnhap.component';



export const routes: Routes = [
    {path:"",component:TrangchuComponent},
    {path:"trangchu",component:TrangchuComponent},
    {path:"gioithieu",component:GioithieuComponent},
    {path:"sanpham",component:SanphamComponent},
    {path:"lienhe",component:LienheComponent},
    {path:"timkiem",component:TimkiemComponent},
    {path:"chitiet/:id",component:ChitietsanphamComponent},
    {path:"giohang",component:GiohangComponent},
    {path:"dangky",component:DangkyComponent},
    {path:"dangnhap",component:DangnhapComponent},
    {path: "yeuthich", component: YeuthichComponent},
    {path: "sanpham3mien", component: Sanpham3mienComponent},
    {path: "comment", component: CommentComponent}

    
];
