import { ICart } from './../../../core/components/shopping-cart/shopping-cart.interface';
import { loadData, closeAlert } from '@shared/alerts/alerts';
import { ProductsService } from '@core/services/products.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { CURRENCY_SELECT } from '@core/constants/config';
import { CartService } from '@shop/core/services/cart-service.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  product : IProduct;
  selectImage: string;
  currencySelect = CURRENCY_SELECT
  screens = [];
  relationalProducts: Array<object> = [];
  randomItems: Array<IProduct>=[];
  loading: boolean
  constructor(private productService: ProductsService, private activatedRoute: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      loadData('Cargando','Por Favor Espera')
      this.loading = true
      this.loadDataValue(+params.id);
    })
    
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data.subtotal === 0) {
        this.product.qty = 1;
        return;
      }
      this.product.qty = this.findProduct(+this.product.id).qty;
    })
    
  }

  loadDataValue(id: number){
    this.productService.getItem(id).subscribe(result =>{
      this.product = result.product
      const saveProductInCart = this.findProduct(+this.product.id);
      this.product.qty = (saveProductInCart !== undefined)? saveProductInCart.qty : this.product.qty
      this.selectImage = this.product.img;
      this.screens = result.screens;
      this.relationalProducts = result.relational;
      this.randomItems = result.random
      this.loading = false;
      closeAlert()
    });
  }

  changeValue(qty: number){
    this.product.qty = qty
  }

  selectOtherPlatform($event){
    this.loadDataValue(+$event.target.value)
  }

  selectImgMain(i){
    this.selectImage = this.screens[i];
  }

  addToCart(){
    this.cartService.manageProduct(this.product)
  }

  findProduct(id: number){
    return this.cartService.cart.products.find(item => +item.id === id);
  }

}
