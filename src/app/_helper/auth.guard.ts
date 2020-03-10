import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.exp > new Date()) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    if (currentUser !== null) {
      this.router.navigate(['/account/login'], {queryParams: {returnUrl: state.url, mail: currentUser.mail}});
      return false;
    }

    this.router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
