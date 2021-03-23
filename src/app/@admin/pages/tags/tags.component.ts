import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColums } from '@core/interfaces/table-colums.interface';
import { TAG_LIST_QUERY } from '@graphql/operations/query/tag';
import { optionsWithDetailsBasic, tagFormBasicDialog } from '@shared/alerts/alerts';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { DocumentNode } from 'graphql';
import { TagsService } from './tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  query: DocumentNode = TAG_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>

  constructor(private service: TagsService){}

  ngOnInit(): void {    
    this.context = {};
    this.itemsPage = 5;
    this.resultData = {
      listKey: 'tags',
      definitionKey: 'tags'
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#'
      },
      {
        property: 'name',
        label: 'Tag'
      },
      {
        property: 'slug',
        label: 'Slug'
      }
    ]
  }

  async takeAction($event){
    const action = $event[0];
    const tag = $event[1];
    const defaultValue = tag.name !== undefined && tag.name !==''? tag.name: '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    switch (action) {
      case 'add':
        this.addForm(html);
      break;
      case 'edit':
        this.updateForm(html, tag)
      break;
      case 'info':
        const result = await optionsWithDetailsBasic('Detalles', `${tag.name} (${tag.slug})`, 400);
        if (result) {
          this.updateForm(html, tag);
        } else if(result === false){
          this.blockForm(tag);
        }
      break;
      case 'block':
        this.blockForm(tag)
      break;
    
      default:
      break;
    }
  }

  //Añadir Tag Desde el boton añadir
  private addTag(result){
    if (result.value) {
      this.service.addTag(result.value).subscribe((res: any) =>{
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message)
      })
    }
  }

  //Modificar Genero Desde el icono edit
  private updateTag(id: string, result){
    if (result.value) {
      this.service.updateTag(id, result.value).subscribe((res: any) =>{
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message)
      })
    }
  }

  //Bloquear Tag Desde el icono block
  private blockTag(id: string){
    this.service.blockTag(id).subscribe((res: any) =>{
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message)
    });
  }

  // Actualizar Tag desde detalles
  private async updateForm(html: string, tag: any){
    const result = await tagFormBasicDialog('Modificar Tag', html, 'name');
    this.updateTag(tag.id, result);
  }

  //Bloquear genero desde detalles
  private async blockForm(tag: any){
    const result = await optionsWithDetailsBasic('¿Bloquear?',`Si bloqueas el item, este no se mostrarà`,400, 'No Bloquear', 'Bloquear');
    if (result === false) {
      this.blockTag(tag.id);
    }
  }

  private async addForm(html: string){
    const result = await tagFormBasicDialog('Añadir Tag', html, 'name');
    this.addTag(result);
  }

}
