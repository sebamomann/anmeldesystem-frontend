import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.currentUserValue;
    let newRequest = request;
    if (currentUser && currentUser.token) {
      console.log(request.headers);
      newRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
          Test: `okay`
        }
      });
    }

    return next.handle(newRequest);
  }
}
