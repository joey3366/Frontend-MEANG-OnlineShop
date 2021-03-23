import { ACTIVE_FILTERS } from '@core/constants/filters';
import { ITableColums } from '@core/interfaces/table-colums.interface';
import { IResultData, IInfoPage } from '@core/interfaces/result-data.interface';  
import { TablePaginationService } from './table-pagination.service';
import { DocumentNode } from 'graphql';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {

  @Input() query: DocumentNode;
  @Input() context: object;
  @Input() itemsPage = 20;
  @Input() include = true;
  @Input() resultData: IResultData;
  @Input() tableColumns: Array<ITableColums> = undefined;
  @Input() filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE
  @Output() manageItem = new EventEmitter<Array<any>>();
  infoPage: IInfoPage;
  data$: Observable<any>;

  constructor(private service: TablePaginationService) { }

  ngOnInit(): void {
    console.log(this.query);
    if (this.query === undefined) {
      throw new Error('Query Indedifida');
    }
    if (this.resultData === undefined) {
      throw new Error('Result Data Indedifida');
    }
    if (this.tableColumns === undefined) {
      throw new Error('Columna en la tabla esta Indedifida');
    }
    this.infoPage={
      page:1,
      pages:1,
      itemsPage: this.itemsPage,
      total:1
    }
    this.loadData();
  }
  loadData(){
    const variables = {
      page: this.infoPage.page,
      itemsPage: this.infoPage.itemsPage,
      include: this.include,
      active: this.filterActiveValues
    }
    this.data$ = this.service.getCollectionData(this.query, variables, {}).pipe(map((result:any) => {
      const data = result[this.resultData.definitionKey];
      this.infoPage.pages = data.info.pages;
      this.infoPage.total = data.info.total;
      return data[this.resultData.listKey]
    }));
    
  }
  changePage(){
    this.loadData();
  }

  manageAction(action: string, data: any){
    this.manageItem.emit([action, data])
  }

}
