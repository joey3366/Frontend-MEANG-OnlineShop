import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import carouselItems from '@data/carousel.json';
import productsList from '@data/products.json';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ProductsService } from '@core/services/products.service';
import { ACTIVE_FILTERS } from '@core/constants/filters';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  items: ICarouselItem[] = [];
  productsList;
  listOne;
  listTwo;
  listThree;
  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    
    this.productService
      .getByPlatform(1, 4, ACTIVE_FILTERS.ACTIVE, true, '18')
      .subscribe((result) => {
        this.listOne = result;
    });

    this.productService
     .getByLastUnitsOffers(1, 4, ACTIVE_FILTERS.ACTIVE, true, 40)
      .subscribe((result) => {
        this.listTwo = result;
      });
    this.productService
      .getByPlatform(1, 4, ACTIVE_FILTERS.ACTIVE, true, '4')
      .subscribe((result) => {
        this.listThree = result;
      });
    this.productService
      .getByLastUnitsOffers(1, 5, ACTIVE_FILTERS.ACTIVE, true, -1, 20)
      .subscribe((result: IProduct[]) => {
        result.map((item: IProduct) => {
          this.items.push({
            id: item.id,
            title: item.name,
            description: item.description,
            background: item.img,
            url: '',
          });
        });
      });
    this.productsList = productsList;
  }

  addToCart($event: IProduct) {
    console.log('eso');
  }

  showProductDetails($event: IProduct) {
    console.log('Que inventa locota');
  }
}
