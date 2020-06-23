import {Inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {WINDOW} from '../provider/window.provider';
import {Observable} from 'rxjs';
import {IUserModel} from '../models/IUserModel.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }

  public get(): Observable<HttpEvent<IUserModel>> {
    const url = `${environment.API_URL}users`;
    const req = new HttpRequest('GET', url, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }

  register(userData: { password: any; mail: any; username: any }) {
    const url = `${environment.API_URL}user/`;
    return this.httpClient.post<any>(url, {
      user: userData,
      domain: this.window.location.hostname + '/account/verify'
    }, {observe: 'response', reportProgress: true});
  }

  validatePasswordresetToken(mail: string, token: string) {
    const url = `${environment.API_URL}user/passwordreset/validate/${mail}/${token}`;
    return this.httpClient.get<null>(url, {observe: 'response', reportProgress: true});
  }

  initReset(mail: string) {
    const url = `${environment.API_URL}user/passwordreset/`;
    return this.httpClient.post<{ mail: string, domain: string }>(url, {
      mail,
      domain: this.window.location.hostname + '/account/passwordreset'
    }, {observe: 'response', reportProgress: true});
  }

  resetPassword(password: string, mail: string, token: string): Observable<HttpEvent<string>> {
    const url = `${environment.API_URL}user/passwordreset/${mail}/${token}`;
    const req = new HttpRequest('PUT', url, {password}, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }

  activateUserByEmail(mail: string, token: string) {
    const url = `${environment.API_URL}user/verify/${mail}/${token}`;
    return this.httpClient.get<null>(url, {observe: 'response', reportProgress: true});
  }

  changeEmail(mail: string, token: string) {
    const url = `${environment.API_URL}user/mail/verify/${mail}/${token}`;
    return this.httpClient.get<null>(url, {observe: 'response', reportProgress: true});
  }

  resendMailChange() {
    console.log('resend');
    const url = `${environment.API_URL}user/mail/change/resend`;
    const domain = this.window.location.hostname + '/account/mail/verify';
    const req = new HttpRequest('POST', url, {domain}, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }

  cancelMailChange() {
    console.log('cancel mail change');
    const url = `${environment.API_URL}user/mail/change/cancel`;
    const req = new HttpRequest('GET', url, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }
}
