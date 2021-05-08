import { ACTIVE_FILTERS } from '@core/constants/filters';
import { basicAlert } from '@shared/alerts/toasts';
import { GenresService } from './genres.service';
import { ITableColums } from '@core/interfaces/table-colums.interface';
import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { GENRE_LIST_QUERY } from '@graphql/operations/query/genre';
import { DocumentNode } from 'graphql';
import {
  genreFormBasicDialog,
  optionsWithDetailsBasic,
} from '@shared/alerts/alerts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constants/title.constants';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  query: DocumentNode = GENRE_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;
  filterActiveValues = ACTIVE_FILTERS.ACTIVE;

  constructor(private service: GenresService, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.GENRES)
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'genres',
      definitionKey: 'genres',
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Genero',
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
    const genre = $event[1];
    const defaultValue =
      genre.name !== undefined && genre.name !== '' ? genre.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    switch (action) {
      case 'add':
        this.addForm(html);
        break;
      case 'edit':
        this.updateForm(html, genre);
        break;
      case 'info':
        const result = await optionsWithDetailsBasic(
          'Detalles',
          `${genre.name} (${genre.slug})`,
          genre.active !== false ? 375 : 400,
          '<i class="fas fa-edit"></i> Editar',
          genre.active !== false
            ? '<i class="fas fa-lock"></i> Bloquear'
            : '<i class="fas fa-lock-open"></i> Desbloquear'
        );
        if (result) {
          this.updateForm(html, genre);
        } else if (result === false) {
          this.unblockForm(genre, (genre.active !== false) ? false : true);
        }
      break;
      case 'block':
        this.unblockForm(genre, false);
      break;
      case 'unblock':
        this.unblockForm(genre, true);
      break;

      default:
        break;
    }
  }

  //Añadir Genero Desde el boton añadir
  private addGenre(result) {
    if (result.value) {
      this.service.addGenre(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  //Modificar Genero Desde el icono edit
  private updateGenre(id: string, result) {
    if (result.value) {
      this.service.updateGenre(id, result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  //Bloquear Genero Desde el icono block
  private blockGenre(id: string, unblock: boolean) {
    this.service.unblockGenre(id, unblock).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }

  // Actualizar Genero desde detalles
  private async updateForm(html: string, genre: any) {
    const result = await genreFormBasicDialog('Modificar genero', html, 'name');
    this.updateGenre(genre.id, result);
  }

  //Bloquear genero desde detalles
  private async unblockForm(genre: any, unblock: boolean) {
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
      this.blockGenre(genre.id, unblock);
    }
  }

  private async addForm(html: string) {
    const result = await genreFormBasicDialog('Añadir genero', html, 'name');
    this.addGenre(result);
  }
}
