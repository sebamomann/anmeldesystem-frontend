import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IUserModel} from '../models/IUserModel.model';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {WINDOW} from '../provider/window.provider';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }

  updateValues(toChange: any, {id}): Observable<HttpEvent<IUserModel>> {
    console.log('update user', toChange);
    toChange.domain = this.window.location.hostname + '/account/mail/verify';
    const req = new HttpRequest('PUT', `${environment.api.url}user`, toChange, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }
}

