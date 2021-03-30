import { ACTIVE_FILTERS } from '@core/constants/filters';
import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColums } from '@core/interfaces/table-colums.interface';
import { TAG_LIST_QUERY } from '@graphql/operations/query/tag';
import {
  optionsWithDetailsBasic,
  tagFormBasicDialog,
} from '@shared/alerts/alerts';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { DocumentNode } from 'graphql';
import { TagsService } from './tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  query: DocumentNode = TAG_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;
  filterActiveValues = ACTIVE_FILTERS.ACTIVE;

  constructor(private service: TagsService) {}

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 5;
    this.resultData = {
      listKey: 'tags',
      definitionKey: 'tags',
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Tag',
      },
      {
        property: 'slug',
        label: 'Slug',
      },
      {
        property: 'active',
        label: '¿Activo?',
      },
    ];
  }

  async takeAction($event) {
    const action = $event[0];
    const tag = $event[1];
    const defaultValue =
      tag.name !== undefined && tag.name !== '' ? tag.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    switch (action) {
      case 'add':
        this.addForm(html);
        break;
      case 'edit':
        this.updateForm(html, tag);
        break;
      case 'info':
        const result = await optionsWithDetailsBasic(
          'Detalles',
          `${tag.name} (${tag.slug})`,
          tag.active !== false ? 375 : 400,
          '<i class="fas fa-edit"></i> Editar',
          tag.active !== false
            ? '<i class="fas fa-lock"></i> Bloquear'
            : '<i class="fas fa-lock-open"></i> Desbloquear'
        );
        if (result) {
          this.updateForm(html, tag);
        } else if (result === false) {
          this.unblockForm(tag, (tag.active !== false) ? false : true);
        }
        break;
      case 'block':
        this.unblockForm(tag, false);
        break;
        case 'unblock':
          this.unblockForm(tag, true);
        break;

      default:
        break;
    }
  }

  //Añadir Tag Desde el boton añadir
  private addTag(result) {
    if (result.value) {
      this.service.addTag(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  //Modificar Genero Desde el icono edit
  private updateTag(id: string, result) {
    if (result.value) {
      this.service.updateTag(id, result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  //Bloquear Tag Desde el icono block
  private blockTag(id: string, unblock: boolean) {
    this.service.unblockTag(id, unblock).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }

  // Actualizar Tag desde detalles
  private async updateForm(html: string, tag: any) {
    const result = await tagFormBasicDialog('Modificar Tag', html, 'name');
    this.updateTag(tag.id, result);
  }

  //Bloquear genero desde detalles
  private async unblockForm(tag: any, unblock: boolean) {
    const result =  unblock ? await optionsWithDetailsBasic(
      '¿Desbloquear?',
      `Si Desbloqueas el item, este ya se mostrarà`,
      500,
      'No Desbloquear',
      'Desbloquear'
    ): await optionsWithDetailsBasic(
      '¿Bloquear?',
      `Si bloqueas el género seleccionado, no se mostrará en la lista`,
      430,
      'No, no bloquear',
      'Si, bloquear'
    );
    if (result === false) {
      this.blockTag(tag.id, unblock);
    }
  }

  private async addForm(html: string) {
    const result = await tagFormBasicDialog('Añadir Tag', html, 'name');
    this.addTag(result);
  }
}
