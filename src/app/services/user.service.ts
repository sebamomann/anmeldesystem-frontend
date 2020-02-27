import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IUserModel} from '../models/IUserModel.model';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  updateValues(toChange: {}, {id}): Observable<HttpEvent<IUserModel>> {
    console.log('update user', toChange);
    const req = new HttpRequest('PUT', `${environment.api.url}user`, toChange, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }
}

