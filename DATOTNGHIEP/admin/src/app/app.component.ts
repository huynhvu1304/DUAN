import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UserService } from './user.service'; 
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgxEchartsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'admin';
   showHeader = true;
    constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.checkTokenExpiry();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Dùng urlAfterRedirects để chính xác hơn
        const currentUrl = event.urlAfterRedirects;
        this.showHeader = currentUrl !== '/dangnhap';

        console.log('🔁 Navigated to:', currentUrl, ' | showHeader:', this.showHeader);
      }
    });
  }
}
