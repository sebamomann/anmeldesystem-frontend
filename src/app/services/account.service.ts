import {Inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {WINDOW} from '../provider/window.provider';
import {Observable} from 'rxjs';
import {IUserModel} from '../models/IUserModel.model';
import {IUserModelRegister} from '../models/IUserModelRegister.model';

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

  public register(userData: IUserModelRegister) {
    const url = `${environment.API_URL}users`;
    const body = {
      user: userData,
      domain: `${this.window.location.hostname}/account/verify/{{0}}/{{1}}`
    };

    return this.httpClient
      .post<IUserModel>(url, body, {
          observe: 'response',
          reportProgress: true
        }
      );
  }

  public activate(mail: string, token: string) {
    const url = `${environment.API_URL}users/verify/${window.btoa(mail)}/${token}`;
    return this.httpClient.get<null>(url, {observe: 'response', reportProgress: true});
  }

  public updateValues(body: any): Observable<HttpEvent<IUserModel>> {
    body.domain = this.window.location.hostname + '/account/mail/verify';

    const url = `${environment.API_URL}users`;

    const req = new HttpRequest('PUT', url, body, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }

  public initializePasswordReset(mail: string) {
    const url = `${environment.API_URL}users/passwordreset`;

    const body = {
      mail,
      domain: this.window.location.hostname + '/account/passwordreset/{{0}}/{{1}}'
    };

    return this.httpClient.post<void>(url, body, {observe: 'response', reportProgress: true});
  }

  public validatePasswordresetToken(mail: string, token: string) {
    const url = `${environment.API_URL}users/passwordreset/validate/${window.btoa(mail)}/${token}`;

    return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
  }


  public resetPassword(password: string, mail: string, token: string) {
    const url = `${environment.API_URL}users/passwordreset/${mail}/${token}`;
    const req = new HttpRequest('PUT', url, {password}, {
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }

  public changeEmail(mail: string, token: string) {
    const url = `${environment.API_URL}users/mail/verify/${window.btoa(mail)}/${token}`;

    return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
  }

  public resendMailChange() {
    const url = `${environment.API_URL}users/mail/change/resend`;
    const domain = this.window.location.hostname + '/account/mail/verify';

    const req = new HttpRequest('POST', url, {domain}, {
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }

  public cancelMailChange() {
    const url = `${environment.API_URL}users/mail/change/cancel`;
    const req = new HttpRequest('GET', url, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }
}
