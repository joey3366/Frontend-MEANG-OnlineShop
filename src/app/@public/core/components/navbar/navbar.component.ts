import { ICart } from './../shopping-cart/shopping-cart.interface';
import { Router } from '@angular/router';
import { REDIRECT_ROUTES } from '@core/constants/config';
import { CartService } from './../../services/cart-service.service';
import { IMeData } from '@core/interfaces/session.interface';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import shopMenuItems from '@data/menus/shop.json';
import { IMenuItem } from '@core/interfaces/menu-item.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  menuItems: Array<IMenuItem> = shopMenuItems
  session: IMeData = {status: false};
  access = false;
  role: string;
  userLabel = '';
  cartItemsTotal: number;
  constructor(private auth: AuthService, private cartService: CartService, private router: Router) {
    this.auth.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userLabel = `${this.session.user?.name} ${this.session.user?.lastname}`;
    });
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cartItemsTotal = data.subtotal
      }
    })
   }

  ngOnInit(): void {
    this.cartItemsTotal = this.cartService.initialize().subtotal
  }

  logout(){
    if (REDIRECT_ROUTES.includes(this.router.url)) {
      localStorage.setItem('route_after_login', this.router.url)
    }
    this.auth.resetSession();
  }

  open(){
    this.cartService.openNav();
  }

}
