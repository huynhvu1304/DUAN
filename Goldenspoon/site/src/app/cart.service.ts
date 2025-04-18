import { Injectable } from '@angular/core';
import { ProductInterface } from './product-interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  cart: any[]=[];
  addCart(product: ProductInterface, quantity: number) {
    const index =this.cart.findIndex((item: ProductInterface)=>item._id === product._id);
    if(index === -1 ){
      this.cart.push({...product, quantity});

    }else{
      this.cart[index].quantity +=quantity;
    }
  }
  getCart(){
    return this.cart
  }
  getSumMoney(){
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  getCartLength(){
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }
  removeFromCart(productId: string) {
    this.cart = this.cart.filter((item: ProductInterface) => item._id !== productId);
  
  }
}
