import { CURRENCY_SELECT } from '@core/constants/config';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ICart } from './shopping-cart.interface';
import { Component, OnInit } from '@angular/core';
import { CartService } from '@shop/core/services/cart-service.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cart: ICart
  currencySelect = CURRENCY_SELECT
  constructor(private cartService: CartService) { 
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cart = data
      }
    })
  }

  ngOnInit(): void {
    this.cart = this.cartService.initialize()
  }


  closeNav(){
    this.cartService.close()
  }

  clear(){
    this.cartService.clear()
  }

  clearItem(product: IProduct){
    product.qty = 0;
    this.cartService.manageProduct(product);
  }

  changeValue(qty: number, product: IProduct) {
    product.qty = qty;
    this.cartService.manageProduct(product)
  }

  proccess(){
    
  }
}
