import { map } from 'rxjs/operators';
import { BLOCK_USER, UPDATE_USER } from '@graphql/operations/mutation/user';
import { ApiService } from '@graphql/services/api.service';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { UsersService } from '@core/services/users.service';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class UsersAdminService extends ApiService{

  constructor(private userService: UsersService, apollo: Apollo) { 
    super(apollo);
  }

  register(user: IRegisterForm){
    return this.userService.register(user);
  }

  update(user: IRegisterForm){
    return this.set(UPDATE_USER, {user, include: false}).pipe(map((result:any) =>{
      return result.updateUser
    }));
  }

  block(id: string){
    return this.set(BLOCK_USER, {id}).pipe(map((result: any) =>{
      return result.blockUser
    }));
  }
}
