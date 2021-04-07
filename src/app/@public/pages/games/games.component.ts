import { closeAlert } from './../../../@shared/alerts/alerts';
import { GAMES_PAGES_INFO, TYPE_OPERATION } from './game.constants';
import { IInfoPage } from '@core/interfaces/result-data.interface';
import { ProductsService } from '@core/services/products.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { ActivatedRoute } from '@angular/router';
import { IGamePageInfo } from './games-page.interface';
import { loadData } from '@shared/alerts/alerts';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  selectPage;
  infoPage: IInfoPage = { page: 1, pages: 8, total: 160, itemsPage: 16 };
  typeData: TYPE_OPERATION;
  gamesPageInfo: IGamePageInfo;
  productsList: Array<IProduct> = [];
  loading: boolean;
  constructor(
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true
    loadData('Cargando', 'Espera Por Favor')
    this.activatedRoute.params.subscribe((params) => {
      const keyPage = `${params.type}/${params.filter}`;
      this.gamesPageInfo = GAMES_PAGES_INFO[keyPage];
      this.typeData = params.type;
      this.selectPage = 1;
      this.loadData();
    });
  }

  loadData() {
    if (this.typeData === TYPE_OPERATION.PLATFORMS) {
      this.productService
        .getByPlatform(
          this.selectPage,
          this.infoPage.itemsPage,
          ACTIVE_FILTERS.ACTIVE,
          false,
          this.gamesPageInfo.platformsIds,
          true,
          true
        )
        .subscribe((data) => {
          this.asignResult(data);
        });
      return;
    }
    this.productService
      .getByLastUnitsOffers(
        this.selectPage,
          this.infoPage.itemsPage,
          ACTIVE_FILTERS.ACTIVE,
          false,
          this.gamesPageInfo.topPrice,
          this.gamesPageInfo.stock,
          true,
          true
      )
      .subscribe((data) => {
        this.asignResult(data);
      });
  }

  private asignResult(data){
    this.productsList = data.result;
    this.infoPage = data.info
    closeAlert();
    this.loading = false;
  }
}
