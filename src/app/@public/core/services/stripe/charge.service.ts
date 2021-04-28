import { CREATE_PAY_ORDER } from '@graphql/operations/mutation/stripe/charge';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { Apollo } from 'apollo-angular';
import { ApiService } from '@graphql/services/api.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CHARGES_CUSTOMER_LIST } from '@graphql/operations/query/stripe/charge';

@Injectable({
  providedIn: 'root',
})
export class ChargeService extends ApiService {
  constructor(apollo: Apollo) {
    super(apollo);
  }

  pay(payment: IPayment) {
    return this.set(CREATE_PAY_ORDER, { payment }).pipe(
      map((result: any) => {
        return result.chargeOrder;
      })
    );
  }

  listByCustomer(
    customer: string,
    limit: number,
    startingAfter: string,
    endingBefore: string
  ) {
    return this.get(CHARGES_CUSTOMER_LIST, {
      customer,
      limit,
      startingAfter,
      endingBefore,
    }).pipe(
      map((result: any) => {
        return result.chargesByCustomer;
      })
    );
  }
}
