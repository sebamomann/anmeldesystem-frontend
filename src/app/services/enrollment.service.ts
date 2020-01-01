import {Injectable} from '@angular/core';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private readonly httpClient: HttpClient) {
  }

  delete(enrollment: IEnrollmentModel) {
    const req = new HttpRequest('DELETE', `${environment.api.url}enrollment/${enrollment.id}`, {
      observe: 'response',
    });
    return this.httpClient.request(req);
  }
}
