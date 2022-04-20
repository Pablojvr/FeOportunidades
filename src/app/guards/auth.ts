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
    } else {

      var  hasPermission = route.data.permission && typeof user.rol[route.data.permission[0]] != undefined;
      var  checkPermission = route.data.permission && user.rol[route.data.permission[0]]==false;

      if (route.data.permission && !hasPermission && !checkPermission) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorised so return true
      return true;
    }

  }
}
