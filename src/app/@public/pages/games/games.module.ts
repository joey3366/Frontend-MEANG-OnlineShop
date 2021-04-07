import { FormsModule } from '@angular/forms';
import { ProductCategoryListModule } from '@core/components/product-category-list/product-category-list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [GamesComponent],
  imports: [
    CommonModule,
    GamesRoutingModule,
    ProductCategoryListModule,
    NgbPaginationModule,
    FormsModule
  ]
})
export class GamesModule { }
