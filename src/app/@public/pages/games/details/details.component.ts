import { loadData, closeAlert } from '@shared/alerts/alerts';
import { ProductsService } from '@core/services/products.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { CURRENCY_SELECT } from '@core/constants/config';
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
  constructor(private productService: ProductsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      loadData('Cargando','Por Favor Espera')
      this.loading = true
      this.loadDataValue(+params.id);
    })
    
    
  }

  loadDataValue(id: number){
    this.productService.getItem(id).subscribe(result =>{
      this.product = result.product
      this.selectImage = this.product.img;
      this.screens = result.screens;
      this.relationalProducts = result.relational;
      this.randomItems = result.random
      this.loading = false;
      closeAlert()
    });
  }

  changeValue(qty: number){
    console.log('sis')
  }

  selectOtherPlatform($event){
    this.loadDataValue(+$event.target.value)
  }
  selectImgMain(i){
    this.selectImage = this.screens[i];
  }
}
