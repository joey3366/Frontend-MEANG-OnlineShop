import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { ApiService } from '@graphql/services/api.service';
import { Injectable } from '@angular/core';
import { ADD_GENRE, BLOCK_GENRE, MODIFY_GENRE } from '@graphql/operations/mutation/genre';

@Injectable({
  providedIn: 'root',
})
export class GenresService extends ApiService {
  constructor(apollo: Apollo) {
    super(apollo);
  }

  addGenre(genre: string) {
    return this.set(ADD_GENRE, { genre }, {}).pipe(
      map((result: any) => {
        return result.addGenre;
      })
    );
  }

  updateGenre(id: string, genre: string) {
    return this.set(MODIFY_GENRE, { id, genre }, {}).pipe(
      map((result: any) => {
        return result.updateGenre;
      })
    );
  }

  unblockGenre(id: string, unblock: boolean) {
    return this.set(BLOCK_GENRE, { id, unblock }, {}).pipe(
      map((result: any) => {
        return result.blockGenre;
      })
    );
  }
}
