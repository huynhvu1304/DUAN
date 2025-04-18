import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-giohang',
  imports: [CommonModule, FormsModule],
  templateUrl: './giohang.component.html',
  styleUrl: './giohang.component.css'
})
export class GiohangComponent {
  cart:any=[];
  constructor(private cartService: CartService){}
  ngOnInit():void{
    this.cart=this.cartService.getCart();
  }
  sumMoney():number{
    return this.cartService.getSumMoney();
  }
  
  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
    this.cart = [...this.cartService.getCart()]; 
  }
}
