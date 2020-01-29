import {Inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {WINDOW} from '../provider/window.provider';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }

  login(userCredentials: { password: any; username: any }) {
    return undefined;
  }

  register(userData: { password: any; email: any; username: any }) {
    return undefined;
  }

  validatePasswordresetToken(mail: string, token: string) {
    const url = `${environment.api.url}user/passwordreset/validate/${mail}/${token}`;
    return this.httpClient.get<null>(url, {observe: 'response', reportProgress: true});
  }

  initReset(mail: string) {
    const url = `${environment.api.url}user/passwordreset/`;
    return this.httpClient.post<{ mail: string, domain: string }>(url, {
      mail,
      domain: this.window.location.hostname + '/account/passwordreset'
    }, {observe: 'response', reportProgress: true});
  }

  resetPassword(password: string, mail: string, token: string): Observable<HttpEvent<string>> {
    const url = `${environment.api.url}user/passwordreset/${mail}/${token}`;
    const req = new HttpRequest('PUT', url, {password}, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }
}
