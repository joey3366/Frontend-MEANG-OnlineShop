import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { CURRENCY_CODE } from '@core/constants/config';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { infoEventAlert, loadData } from '@shared/alerts/alerts';
import { environment } from './../../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { IMeData } from '@core/interfaces/session.interface';
import { Component, OnInit } from '@angular/core';
import { StripePaymentService } from '@mugan86/stripe-payment-form';
import { take } from 'rxjs/internal/operators/take';
import { CartService } from '@shop/core/services/cart-service.service';
import { CustomerService } from '@shop/core/services/stripe/customer.service';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';
import { IMail } from '@core/interfaces/mail.interface';
import { MailService } from '@core/services/mail.service';
import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { IStock } from '@core/interfaces/stock.interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  meData: IMeData;
  key = environment.stripePublicKey;
  address = '';
  available = false;
  block = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private stripePaymentService: StripePaymentService,
    private cartService: CartService,
    private customerService: CustomerService,
    private chargeService: ChargeService,
    private mailService: MailService
  ) {
    this.authService.accessVar$.subscribe((data: IMeData) => {
      if (!data.status) {
        this.router.navigate(['/login']);
        return;
      }
      this.meData = data;
    });
    this.cartService.itemsVar$.pipe(take(1)).subscribe(() => {
      if (this.cartService.cart.total === 0 && this.available === false) {
        this.available = false;
        this.notAvailableProduct();
      }
    });
    this.stripePaymentService.cardTokenVar$
      .pipe(take(1))
      .subscribe((token: string) => {
        if (
          token.indexOf('tok_') > -1 &&
          this.meData.status &&
          this.address !== ''
        ) {
          if (this.cartService.cart.total === 0) {
            this.available = false;
            this.notAvailableProduct();
          }
          const payment: IPayment = {
            token,
            amount: this.cartService.cart.total.toString(),
            description: this.cartService.orderDescription(),
            customer: this.meData.user.stripeCustomer,
            currency: CURRENCY_CODE,
          };
          const stockManage: Array<IStock> = [];
          this.cartService.cart.products.map((item: IProduct) => {
            stockManage.push({ id: +item.id, increment: item.qty * (-1)})
          })
          this.block = true;
          loadData('Realizando pago', 'Espera unos instantes');
          this.chargeService
            .pay(payment, stockManage)
            .pipe(take(1))
            .subscribe(
              async (result: {
                status: boolean;
                message: string;
                charge: ICharge;
              }) => {
                if (result.status) {
                  await infoEventAlert(
                    'Pedido pagado',
                    'Gracias por su compra',
                    TYPE_ALERT.SUCCESS
                  );
                  this.sendEmail(result.charge);
                  this.router.navigate(['/orders'])
                  this.cartService.clear();
                  return;
                } else {
                  console.log(result)
                  await infoEventAlert(
                    'Pedido No pagado',
                    'Intentelo de nuevo',
                    TYPE_ALERT.WARNING
                  );
                }
                this.block = false;
              }
            );
        }
      });
  }

  ngOnInit(): void {
    this.authService.start();
    if (localStorage.getItem('address')) {
      this.address = localStorage.getItem('address');
      localStorage.removeItem('address');
    }
    this.cartService.initialize();
    localStorage.removeItem('route_after_login');
    this.block = false;
    if (this.cartService.cart.total === 0) {
      this.available = false;
      this.notAvailableProduct();
    } else {
      this.available = true;
    }
  }

  sendData() {
    if (this.meData.user.stripeCustomer == null) {
      infoEventAlert('Cliente no existe', 'No hay cliente');
      const stripeName = `${this.meData.user.name} ${this.meData.user.lastname}`;
      loadData('Procesando', 'Creando cliente');
      this.customerService
        .add(stripeName, this.meData.user.email)
        .pipe(take(1))
        .subscribe(async (result: { status: boolean; message: string }) => {
          if (result.status) {
            await infoEventAlert(
              'Cliente creado correctamente',
              'Reinicia sesión',
              TYPE_ALERT.SUCCESS
            );
            localStorage.setItem('address', this.address);
            localStorage.setItem('route_after_login', this.router.url);
            this.authService.resetSession();
          } else {
            await infoEventAlert(
              'Cliente no añadido',
              result.message,
              TYPE_ALERT.WARNING
            );
          }
        });
      return;
    }
    this.stripePaymentService.takeCardToken(true);
  }

  async notAvailableProduct() {
    this.cartService.close();
    this.available = false;
    await infoEventAlert(
      'Acción no disponible',
      'No se puede pagar sin productos en el carrito de compras'
    );
    this.router.navigate(['/']);
  }

  sendEmail(charge: ICharge) {
    const mail: IMail = {
      to: charge.receiptEmail,
      subject: 'Confirmacion de pedido',
      html: `El pedido se ha realizado correctamente.
    Puedes consultarlo en <a href="${charge.receiptUrl}" target="_blank">esta url</a>`,
    };
    this.mailService.send(mail).pipe(take(1)).subscribe();
  }
}
