import { loadData, closeAlert } from './../../../../../@shared/alerts/alerts';
import { map } from 'rxjs/internal/operators/map';
import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ProductsService } from '@core/services/products.service';

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
  loading: boolean
  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loading = true
    loadData('Cargando', 'Espera Por Favor')
    this.productService.getHomePage().subscribe(data => {
      this.listOne = data.ps4;
      this.listTwo = data .topPrice;
      this.listThree = data.pc;
      this.items = this.manageCarousel(data.carousel)
      closeAlert()
      this.loading = false
    })
  }

  addToCart($event: IProduct) {
    console.log('eso');
  }

  showProductDetails($event: IProduct) {
    console.log('Que inventa locota');
  }

  private manageCarousel(list){
    const itemsValues: Array<ICarouselItem> = [];
    list.shopProducts.map((item) => {
      itemsValues.push({
        id: item.id,
        title: item.product.name,
        description: item.platform.name,
        background: item.product.img,
        url: ''
      });
    });
    return itemsValues;
  }
}
