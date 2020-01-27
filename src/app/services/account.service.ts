import {Inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient} from '@angular/common/http';
import {WINDOW} from '../provider/window.provider';

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
    return this.httpClient.get<IEnrollmentModel>(url, {observe: 'response', reportProgress: true});
  }

  initReset(mail: string) {
    const url = `${environment.api.url}user/passwordreset/`;
    return this.httpClient.post<any>(url, {
      mail,
      domain: this.window.location.hostname + '/account/passwordreset'
    }, {observe: 'response', reportProgress: true});
  }

  resetPassword(password: string, mail: string, token: string) {
    const url = `${environment.api.url}user/passwordreset/${mail}/${token}`;
    return this.httpClient.put<any>(url, {
      password
    }, {
      observe: 'response',
      reportProgress: true
    });
  }
}
