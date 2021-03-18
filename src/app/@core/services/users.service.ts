import { map } from 'rxjs/internal/operators/map';
import { HttpHeaders } from '@angular/common/http';
import { IRegisterForm } from './../interfaces/register.interface';
import { Apollo } from 'apollo-angular';
import { ApiService } from './../../@graphql/services/api.service';
import { Injectable } from '@angular/core';
import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { ACTIVE_USER, REGISTER_USER } from '@graphql/operations/mutation/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService {
  constructor(apollo: Apollo) {
    super(apollo);
  }
  getUsers(page: number = 1, itemsPage: number = 20){
    return this.get(USERS_LIST_QUERY, {
      include: true,
      page,
      itemsPage
    }).pipe(map((result: any) => {
      return result.users;
    }));
  }

  register(user: IRegisterForm){
    return this.set(REGISTER_USER, {user, include: false}).pipe(map((result: any) => {
      return result.register;
    }));
  }

  active(token: string, birthday: string, password: string){
    const user = JSON.parse(atob(token.split('.')[1])).user
    return this.set(ACTIVE_USER, { id: user.id, birthday, password}, { headers: new HttpHeaders({
      Authorization: token
    })}).pipe(map((result: any) => {
      return result.activeUserAction
    }))
  }
}
