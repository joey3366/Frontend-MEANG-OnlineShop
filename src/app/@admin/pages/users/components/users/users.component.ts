import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { IResultData } from '@core/interfaces/result-data.interface';
import { DocumentNode } from 'graphql';
import { Component, OnInit } from '@angular/core';
import { ITableColums } from '@core/interfaces/table-colums.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  query: DocumentNode = USERS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 20;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users'
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#'
      },
      {
        property: 'name',
        label: 'Nombre'
      },
      {
        property: 'lastname',
        label: 'Apellido'
      },
      {
        property: 'email',
        label: 'Correo'
      },
      {
        property: 'role',
        label: 'Rol'
      }
    ]
  }

}
