import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.auth.getSession() !== null) {
      const dataDecode: any = this.decodeToken();
      console.log(dataDecode);
      if (dataDecode.exp < new Date().getTime() / 1000) {
        return this.redirect();
      }
      if (dataDecode.user.role === 'ADMIN') {
        console.log('Somos administradores');
        return true;
      }
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
