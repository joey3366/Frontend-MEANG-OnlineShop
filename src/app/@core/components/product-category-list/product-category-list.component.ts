import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { CartService } from '@shop/core/services/cart-service.service';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit {

  @Input() title = 'Titulo De La Categoria'
  @Input() productsList: Array<IProduct> = []
  @Input() description = '';
  @Input() showDesc: boolean;
  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
  }

  addToCart($event: IProduct){
    this.cartService.manageProduct($event)
  }

  showProductDetails($event: IProduct){
    this.router.navigate(['/games/details', + $event.id]);
  }

}
