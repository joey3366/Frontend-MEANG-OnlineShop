import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ShopGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.auth.getSession() !== null) {
      const dataDecode: any = this.decodeToken();
      console.log(dataDecode);
      if (dataDecode.exp < new Date().getTime() / 1000) {
        return this.redirect();
      }
      return true;
    }
    return this.redirect();
  }
  redirect() {
    this.router.navigate(['/login']);
    return false;
  }

 decodeToken() {
    return jwt_decode(this.auth.getSession().token);
  }
}
