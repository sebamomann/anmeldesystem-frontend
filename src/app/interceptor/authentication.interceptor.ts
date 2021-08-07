import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService: AuthenticationService;

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
          Authorization: 'Bearer ' + authHeader,
        }
      });
    }

    return request;
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle request
    request = this.addAuthHeader(request);
    // Handle response
    return next.handle(request);
  }
}
