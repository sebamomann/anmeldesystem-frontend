import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {AuthenticationService} from '../../services/authentication.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  authService: AuthenticationService;
  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  addAuthHeader(request) {
    let authHeader;
    try {
      authHeader = this.authService.accessToken;
    } catch (e) {
      // no auth header available
    }

    if (authHeader) {
      return request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + authHeader
        }
      });
    }
    return request;
  }

  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;

      return this.authService.refreshAccessToken().pipe(
        tap(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next();
        }),
        catchError(() => {
          this.refreshTokenInProgress = false;
          this.logout();

          return null;
        }));
    }
  }

  logout() {
    this.authService.logout();
  }

  handleResponseError(error, request?, next?) {
    // Business error
    if (error.status === 400) {
      // Show message
    } else if (error.status === 401 && !request.url.contains('/login')) {
      return this.refreshToken().pipe(
        switchMap(() => {
          request = this.addAuthHeader(request);
          return next.handle(request);
        }),
        catchError(e => {
          if (e.status !== 401) {
            return this.handleResponseError(e);
          } else {
            this.logout();
          }
        }));
    } else if (error.status === 403) {
      // Show message
      // Logout
      // this.logout();
    } else if (error.status === 500) {
      // Show message
    } else if (error.status === 503) {
      // Show message
      // Redirect to the maintenance page
    }

    return throwError(error);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle request
    request = this.addAuthHeader(request);


    // Handle response
    return next.handle(request).pipe(catchError(error => {
      return this.handleResponseError(error, request, next);
    }));
  }
}
