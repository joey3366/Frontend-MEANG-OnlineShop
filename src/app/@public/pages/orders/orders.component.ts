import { closeAlert } from './../../../@shared/alerts/alerts';
import { loadData } from '@shared/alerts/alerts';
import { AuthService } from '@core/services/auth.service';
import { CURRENCY_SELECT } from '@core/constants/config';
import { Component, OnInit } from '@angular/core';
import { IMeData } from '@core/interfaces/session.interface';
import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  currencySymbol = CURRENCY_SELECT;
  meData: IMeData;
  startingAfter = '';
  hasMore = false;
  charges: Array<ICharge> = [];
  loading = true;
  loadMoreBtn = false;
  constructor(
    private authService: AuthService,
    private chargeService: ChargeService
  ) {
    this.authService.accessVar$.pipe(take(1)).subscribe((meData: IMeData) => {
      this.meData = meData;
      if (this.meData.user.stripeCustomer !== '') {
        this.loadChargesData();
      }
    });
  }

  ngOnInit(): void {
    this.authService.start();
  }

  loadChargesData() {
    loadData('Cargando pedidos', 'Por favor espera');
    this.chargeService
      .listByCustomer(
        this.meData.user.stripeCustomer,
        10,
        this.startingAfter,
        ''
      )
      .pipe(take(1))
      .subscribe((data: { hasMore: boolean, charges: Array<ICharge> }) => {
        console.log(data)
        data.charges.map((item: ICharge) => this.charges.push(item));
        this.hasMore = data.hasMore;
        if (this.hasMore) {
          this.startingAfter = data.charges[data.charges.length -1].id;
          this.loadMoreBtn = true;
        } else {
          this.loadMoreBtn = false;
          this.startingAfter = '';
        }
        closeAlert();
        this.loading = false;
      });
  }
}
