import { ACTIVE_FILTERS } from '@core/constants/filters';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { IResultData } from '@core/interfaces/result-data.interface';
import { DocumentNode } from 'graphql';
import { Component, OnInit } from '@angular/core';
import { ITableColums } from '@core/interfaces/table-colums.interface';
import {
  userFormBasicDialog,
  optionsWithDetailsBasic,
} from '@shared/alerts/alerts';
import { UsersAdminService } from '../../users-admin.service';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constants/title.constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  query: DocumentNode = USERS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;
  filterActiveValues = ACTIVE_FILTERS.ACTIVE;

  constructor(private adminService: UsersAdminService, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.USERS);
    this.context = {};
    this.itemsPage = 20;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users',
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre',
      },
      {
        property: 'lastname',
        label: 'Apellido',
      },
      {
        property: 'email',
        label: 'Correo',
      },
      {
        property: 'role',
        label: 'Rol',
      },
      {
        property: 'active',
        label: '¿Activo?',
      },
    ];
  }

  private initializeForm(user: any) {
    const defaultName =
      user.name !== undefined && user.name !== '' ? user.name : '';
    const defaultLastname =
      user.lastname !== undefined && user.lastname !== '' ? user.lastname : '';
    const defaultEmail =
      user.email !== undefined && user.email !== '' ? user.email : '';
    const roles = new Array(2);
    roles[0] =
      user.role !== undefined && user.role === 'ADMIN' ? 'selected' : '';
    roles[1] =
      user.role !== undefined && user.role === 'CLIENT' ? 'selected' : '';
    return `
    <input id="name" value="${defaultName}" class="swal2-input" placeholder="Nombre" required>
    <input id="lastname" value="${defaultLastname}" class="swal2-input" placeholder="Apellidos" required>
    <input id="email" value="${defaultEmail}" class="swal2-input" placeholder="Correo" required>
    <select id="role" class="swal2-input">
      <option value="ADMIN" ${roles[0]}> ADMIN </option>
      <option value="CLIENT" ${roles[1]}> CLIENTE </option>
    </select>
    `;
  }

  async takeAction($event) {
    const action = $event[0];
    const user = $event[1];
    /*const defaultValue = user.name !== undefined && user.name !==''? user.name: '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;*/
    const html = this.initializeForm(user);
    switch (action) {
      case 'add':
        this.addForm(html);
        break;
      case 'edit':
        this.updateForm(html, user);
        break;
      case 'info':
        const result = await optionsWithDetailsBasic(
          'Detalles',
          `<i class="fas fa-user"></i>&nbsp;&nbsp;${user.name} ${user.lastname}<br/> <i class="fas fa-envelope-open-text"></i>&nbsp;&nbsp; ${user.email}`,
          user.active !== false ? 375 : 400,
          '<i class="fas fa-edit"></i> Editar',
          user.active !== false
            ? '<i class="fas fa-lock"></i> Bloquear'
            : '<i class="fas fa-lock-open"></i> Desbloquear'
        );
        if (result) {
          this.updateForm(html, user);
        } else if (result === false) {
          this.unblockForm(user, (user.active !== false) ? false : true);
        }
        break;
      case 'block':
        this.unblockForm(user, false);
        break;
      case 'unblock':
        this.unblockForm(user, true);
        break;
      default:
        break;
    }
  }

  private addUser(result) {
    if (result.value) {
      const user: IRegisterForm = result.value;
      user.password = '123456';
      user.active = false;
      this.adminService.register(user).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          this.adminService
            .sendEmailActive(res.user.id, user.email)
            .subscribe((resEmail) => {
              resEmail.status
                ? basicAlert(TYPE_ALERT.SUCCESS, resEmail.message)
                : basicAlert(TYPE_ALERT.WARNING, resEmail.message);
            });
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }
  private updateUser(result, id: string) {
    if (result.value) {
      const user = result.value;
      user.id = id;
      this.adminService.update(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private unblockUser(
    id: string,
    unblock: boolean = false,
    admin: boolean = false
  ) {
    this.adminService.unblock(id, unblock, admin).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }

  private async updateForm(html: string, user: any) {
    const result = await userFormBasicDialog('Modificar Usuario', html);
    this.updateUser(result, user.id);
  }

  private async addForm(html: string) {
    const result = await userFormBasicDialog('Añadir Usuario', html);
    this.addUser(result);
  }

  private async unblockForm(user: any, unblock: boolean) {
    const result = unblock
      ? await optionsWithDetailsBasic(
          'Desbloquear?',
          `Si desbloqueas este usuario, podra hacer compras `,
          460,
          'No Desbloquear',
          'Desbloquear'
        )
      : await optionsWithDetailsBasic(
          'Bloquear?',
          `Si Bloqueas este usuario, No podra hacer compras `,
          400,
          'No Bloquear',
          'Bloquear'
        );
    if (result === false) {
      this.unblockUser(user.id, unblock, true);
    }
  }
}
