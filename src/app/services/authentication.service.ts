import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';
import {RouterStateSnapshot} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {LinkUtil} from '../_util/Link.util';
import {AuthenticationValuesService} from './authentication.values.service';
import {AuthConfigService} from './auth-config.service';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  constructor(private oauth: OAuthService, private authenticationValuesService: AuthenticationValuesService,
              private authConfigService: AuthConfigService) {
  }

  public get accessToken(): string {
    return this.oauth.getAccessToken();
  }

  public check(state: RouterStateSnapshot): boolean {
    while (this.authenticationValuesService.refreshingSubject$.getValue() === true) {
      console.log('refreshing');
    }

    if (this.userIsLoggedIn()) {
      return true;
    } else {
      this.login();
    }
  }

  public login() {
    this.authConfigService.initLogin();
  }

  public logout() {
    this.oauth.postLogoutRedirectUri = environment.keycloak.postLogoutRedirectUri;
    this.oauth.logOut();
  }

  public userIsLoggedIn(): boolean {
    return this.oauth.hasValidAccessToken() &&
      this.oauth.hasValidIdToken();
  }

  public openAccountSettings() {
    LinkUtil.openLinkInNewTab(`${environment.keycloak.url}realms/${environment.keycloak.realm}/account/#/personal-info`);
  }
}
