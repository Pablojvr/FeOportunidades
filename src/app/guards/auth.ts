import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var user = localStorage.getItem('loggedInUser')
      ? JSON.parse(localStorage.getItem('loggedInUser') ?? '{}')
      : null;

    // logged in so return true
    if (!user || moment().isAfter(user.expires)) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    return true;
  }
}
