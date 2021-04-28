import { Subject } from 'rxjs';
import { ICart } from './../components/shopping-cart/shopping-cart.interface';
import { Injectable } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Array<IProduct> = [];
  cart: ICart = {
    products: this.products,
    total: 0,
    subtotal: 0
  }
  public itemsVar = new Subject<ICart>();
  public itemsVar$ = this.itemsVar.asObservable();
  constructor() { }

  initialize(){
    const storeData = JSON.parse(localStorage.getItem('cart'));
    if (storeData !== null) {
      this.cart = storeData;
    }
    return this.cart
  }

  manageProduct(product: IProduct){
    const productTotal = this.cart.products.length;
    if (productTotal === 0) {
      this.cart.products.push(product);
    } else {
      let actionUpdateOk = false;
      for (let i = 0; i < productTotal; i++) {
        if (product.id === this.cart.products[i].id) {
          if (product.qty === 0) {
            this.cart.products.splice(i,1)
          } else {
            this.cart.products[i] = product
          }
          actionUpdateOk = true;
          i = productTotal;
        }
      }
      if (!actionUpdateOk) {
        this.cart.products.push(product)
      }
    }
    this.checkoutTotal();
  }

  checkoutTotal(){
    let subtotal = 0;
    let total = 0;
    this.cart.products.map((product: IProduct) => {
      subtotal += product.qty;
      total += (product.qty * product.price)
    })
    this.cart.total = total;
    this.cart.subtotal = subtotal
    this.setInfo();
  }

  public updateItemsInCart(newValue: ICart){
    this.itemsVar.next(newValue)
  }

  openNav(){
    document.getElementById('mySidenav').style.width = "600px";
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('app').style.overflow = 'hidden';
  }

  close() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('app').style.overflow = 'auto';
  }

  clear(){
    this.products = [];
    this.cart = {total: 0, subtotal:0, products:this.products}
    this.setInfo();
    return this.cart;
  }

  orderDescription(){
    let description = '';
    this.cart.products.map((product: IProduct) => {
      description += `${product.name} (${product.description}) X ${product.qty}\n`;
    })
    return description;
  }

  private setInfo(){
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateItemsInCart(this.cart);
  }
}
