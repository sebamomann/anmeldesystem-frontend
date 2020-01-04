import {Injectable} from '@angular/core';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private ENROLLMENT_KEY_KEY = 'enrollmentKey';

  constructor(private readonly httpClient: HttpClient) {
  }

  delete(enrollment: IEnrollmentModel) {
    let body = null;
    const localStorageKey = localStorage.getItem(this.ENROLLMENT_KEY_KEY);
    if (localStorageKey !== null
      && localStorageKey !== '') {
      body = {key: localStorageKey};
    }

    const req = new HttpRequest('DELETE', `${environment.api.url}enrollment/${enrollment.id}`, body, {});
    return this.httpClient.request(req);
  }
}
