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
  constructor(private auth: AuthService, private cartService: CartService) {
    this.auth.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userLabel = `${this.session.user?.name} ${this.session.user?.lastname}`;
    });
   }

  ngOnInit(): void {
  }

  logout(){
    this.auth.resetSession();
  }

  open(){
    this.cartService.openNav();
  }

}
