import { Apollo } from 'apollo-angular';
import { ApiService } from '@graphql/services/api.service';
import { Injectable } from '@angular/core';
import { DASHBOARD_STATS_ELEMENTS } from '@graphql/operations/query/dashboard';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo)
  }

  getStats(){
    return this.get(DASHBOARD_STATS_ELEMENTS).pipe(map((result: any)=> {
      return {
        users: result.users,
        platforms: result.platforms,
        genres: result.genres,
        tags: result.tags,
        shopProducts: result.shopProducts,
        products: result.products
      }
    }))
  }
}
