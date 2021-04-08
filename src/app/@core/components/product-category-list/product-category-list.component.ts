import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit {

  @Input() title = 'Titulo De La Categoria'
  @Input() productsList: Array<IProduct> = []
  @Input() description = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  addToCart($event: IProduct){
    console.log('eso')
  }

  showProductDetails($event: IProduct){
    this.router.navigate(['/games/details', + $event.id]);
  }

}
