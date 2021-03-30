import { Injectable } from '@angular/core';
import { ADD_TAG, BLOCK_TAG, MODIFY_TAG } from '@graphql/operations/mutation/tag';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class TagsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  addTag(tag: string) {
    return this.set(ADD_TAG, { tag }, {}).pipe(
      map((result: any) => {
        return result.addTag;
      })
    );
  }

  updateTag(id: string, tag: string) {
    return this.set(MODIFY_TAG, { id, tag }, {}).pipe(
      map((result: any) => {
        return result.updateTag;
      })
    );
  }

  unblockTag(id: string, unblock: boolean) {
    return this.set(BLOCK_TAG, { id, unblock }, {}).pipe(
      map((result: any) => {
        return result.blockTag;
      })
    );
  }
}
