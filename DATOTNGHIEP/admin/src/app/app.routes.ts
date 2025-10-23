import { Routes } from '@angular/router';
import { DangnhapComponent } from './dangnhap/dangnhap.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DanhsachproComponent } from './danhsachpro/danhsachpro.component';
import { DanhsachdanhmucComponent } from './danhsachdanhmuc/danhsachdanhmuc.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { CaidatprofileComponent } from './caidatprofile/caidatprofile.component';
import { DanhsachbrandComponent } from './danhsachbrand/danhsachbrand.component';
import { DanhsachnguoidungComponent } from './danhsachnguoidung/danhsachnguoidung.component';
import { QuanlybinhluandanhgiatheouserComponent } from './quanlybinhluandanhgiatheouser/quanlybinhluandanhgiatheouser.component';
import { QuanlybinhluandanhgiaComponent } from './quanlybinhluandanhgia/quanlybinhluandanhgia.component';
import { DanhsachdonhangComponent } from './danhsachdonhang/danhsachdonhang.component';
import { QuanlycauhoiComponent } from './quanlycauhoi/quanlycauhoi.component';
import { QuanlycauhoitheospComponent } from './quanlycauhoitheosp/quanlycauhoitheosp.component';
import { QuanlykhuyenmaiComponent } from './quanlykhuyenmai/quanlykhuyenmai.component';
import { DanhsachvoucherComponent } from './danhsachvoucher/danhsachvoucher.component';
import { SpinWheelConfigComponent } from './spin-wheel-config/spin-wheel-config.component';



export const routes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'danhsachpro', component: DanhsachproComponent,canActivate: [AuthGuard]},
    {path: 'danhsachdanhmuc', component: DanhsachdanhmucComponent, canActivate: [AuthGuard]},
    {path:'myprofile', component: MyprofileComponent},
    {path: 'caidatprofile', component: CaidatprofileComponent},
    {path: 'dangnhap', component: DangnhapComponent},
    {path: 'brand', component: DanhsachbrandComponent,canActivate: [AuthGuard]},
    {path: 'danhsachnguoidung', component: DanhsachnguoidungComponent,canActivate: [AuthGuard]},
    {path: 'quanlybinhluandanhgia', component: QuanlybinhluandanhgiaComponent,canActivate: [AuthGuard]},
    {path: 'danhsachdonhang', component: DanhsachdonhangComponent, canActivate: [AuthGuard]},
    {path: 'quanlybinhluandanhgiatheouser', component: QuanlybinhluandanhgiatheouserComponent,canActivate: [AuthGuard]},
    {path: 'quanlycauhoi', component: QuanlycauhoiComponent, canActivate: [AuthGuard]},
    {path: 'quanlycauhoitheosp', component: QuanlycauhoitheospComponent, canActivate: [AuthGuard]},
    {path: 'quanlykhuyenmai', component: QuanlykhuyenmaiComponent, canActivate: [AuthGuard]},
    {path: 'danhsachvoucher', component: DanhsachvoucherComponent, canActivate: [AuthGuard]},
    {path: 'quanlyvongquay', component: SpinWheelConfigComponent, canActivate: [AuthGuard]},
    
];
