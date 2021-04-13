import {Injectable} from '@angular/core';
import {AuthConfig, NullValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {filter} from 'rxjs/operators';
import {AuthenticationValuesService} from './authentication.values.service';
import {IUser} from '../models/IUser.model';

@Injectable()
export class AuthConfigService {

  constructor(
    private readonly oauthService: OAuthService,
    private readonly authConfig: AuthConfig,
    private authenticationValueService: AuthenticationValuesService,
  ) {
  }

  private _decodedAccessToken: any;

  get decodedAccessToken() {
    return this._decodedAccessToken;
  }

  private _decodedIDToken: any;

  get decodedIDToken() {
    return this._decodedIDToken;
  }

  async initAuth(): Promise<any> {
    return new Promise<boolean>((resolveFn, rejectFn) => {
      // const redUrl = localStorage.getItem('redirectUrl');

      if (this.oauthService.hasValidAccessToken()) {
        this.authenticationValueService.refreshing = true;
      }

      // setup oauthService
      this.oauthService.configure(this.authConfig);
      this.oauthService.setStorage(localStorage);
      this.oauthService.tokenValidationHandler = new NullValidationHandler();

      this.oauthService.redirectUri = localStorage.getItem('redirectUrl');

      // if (redUrl) {
      //   this.oauthService.redirectUri = redUrl;
      //   localStorage.getItem('redirectUrl');
      // }

      // subscribe to token events
      this.oauthService.events
        .pipe(filter((e: any) => {
          return e.type === 'token_received';
        }))
        .subscribe(() => {
            this.handleNewToken();
          },
          (err) => {
          });

      // continue initializing app or redirect to login-page

      // if (redUrl) {
      //   localStorage.getItem('redirectUrl');
      // }

      this.oauthService.loadDiscoveryDocument()
        .then(_ => {
          this.oauthService.tryLogin()
            .then((loggedIn) => {
              if (this.oauthService.hasValidAccessToken()) {
                console.log('[KEYCLOAK] - VALID TOKEN');
                // this.router.navigate(['/'], {queryParams: {success1: true}});

                this.authenticationValueService.currentUserSubject$.next(this.oauthService.getIdentityClaims() as IUser);
                this.authenticationValueService.loginStatus$.next(true);
                this.oauthService.setupAutomaticSilentRefresh();

                this.authenticationValueService.refreshing = false;
                resolveFn(true);
              } else {
                this.authenticationValueService.refreshing = true;
                console.log('[KEYCLOAK] - INVALID TOKEN');
                this.oauthService.silentRefresh()
                  .then((res) => {
                    this.authenticationValueService.currentUserSubject$.next(this.oauthService.getIdentityClaims() as IUser);
                    this.authenticationValueService.loginStatus$.next(true);
                    this.oauthService.setupAutomaticSilentRefresh();

                    this.authenticationValueService.refreshing = false;

                    resolveFn(true);
                  })
                  .catch((err) => {
                    console.log('[KEYCLOAK] - ERROR - LOGOUT');
                    this.authenticationValueService.refreshing = false;
                    this.oauthService.revokeTokenAndLogout();
                    resolveFn(true);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              console.log('[KEYCLOAK] - ERROR (after TRY LOGIN)');

              this.authenticationValueService.refreshing = false;
              resolveFn(true);
            });
        })
        .catch((err) => {
          console.log(err);
          console.log('[KEYCLOAK] - ERROR (after LOAD DISCOVERY DOCUMENT)');

          this.authenticationValueService.refreshing = false;
          resolveFn(true);
        });
    });
  }

  public initLogin() {
    this.oauthService.redirectUri = window.location.href;
    localStorage.setItem('redirectUrl', this.oauthService.redirectUri);
    // localStorage.setItem('redirectUrl', this.oauthService.redirectUri);
    this.oauthService.initLoginFlow();
  }

  private handleNewToken() {
    this._decodedAccessToken = this.oauthService.getAccessToken();
    this._decodedIDToken = this.oauthService.getIdToken();
  }
}
