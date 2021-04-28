import { SEND_EMAIL_ACTION } from '@graphql/operations/mutation/mail';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { ApiService } from '@graphql/services/api.service';
import { map } from 'rxjs/internal/operators/map';
import { IMail } from '@core/interfaces/mail.interface';

@Injectable({
  providedIn: 'root'
})
export class MailService extends ApiService {

  constructor(apollo: Apollo) { 
    super(apollo)
  }

  send(mail: IMail){
    return this.set(SEND_EMAIL_ACTION, { mail }).pipe(map((result: any) => {
      return result.sendEmail
    }))
  }
}
