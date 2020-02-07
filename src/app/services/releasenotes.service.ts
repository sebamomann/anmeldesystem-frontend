import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IReleasenote} from '../models/IReleasenote.model';

@Injectable({
  providedIn: 'root'
})
export class ReleasenotesService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<HttpEvent<IReleasenote[]>> {
    const req = new HttpRequest('GET', `${environment.api.url}releasenote`, {
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }
}
