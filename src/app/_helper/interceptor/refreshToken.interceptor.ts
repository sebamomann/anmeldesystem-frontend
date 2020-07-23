import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from '../../services/authentication.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.authService.getRefreshToken()
  );

  private reqCopy;

  constructor(public authService: AuthenticationService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return next

      .handle(request)

      .pipe(
        catchError(error => {
          // We don't want to refresh token for some requests like login or refresh token itself
          // So we verify url and we throw an error if it's the case
          if (
            request.url.includes('auth/token') ||
            request.url.includes('auth/login')
          ) {
            // We do another check to see if refresh token failed
            // In this case we want to logout user and to redirect it to login page

            if (request.url.includes('auth/token')) {
              this.authService.logout();
            }

            return throwError(error);
          }

          // If error status is different than 401 we want to skip refresh token
          // So we check that and throw the error if it's the case
          if (error.status !== 401) {
            return throwError(error);
          }

          if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // – which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject
              .pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next.handle(this.addAuthenticationToken(request))),
              );
          } else {
            this.refreshTokenInProgress = true;

            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);

            // Call auth.refreshAccessToken(this is an Observable that will be returned)
            this.reqCopy = request.clone();

            return this.authService
              .refreshAccessToken()
              .pipe(
                switchMap(() => {
                  this.refreshTokenInProgress = false;

                  request = this.addAuthenticationToken(request);

                  request.headers.delete('If-None-Match');

                  return next.handle(request);
                }),
                catchError(e => {
                  this.refreshTokenInProgress = false;

                  this.authService.logout();
                  return throwError(error);
                })
              );
          }
        })
      );
  }

  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.authService.accessToken;

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.accessToken
      }
    });
  }
}
