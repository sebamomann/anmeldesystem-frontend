import {Injectable} from '@angular/core';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IAppointmentModel} from '../models/IAppointment.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private ENROLLMENT_KEY_KEY = 'enrollmentKey';

  constructor(private readonly httpClient: HttpClient) {
  }

  create(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<HttpResponse<IEnrollmentModel>> {
    const url = `${environment.api.url}enrollment?link=${appointment.link}`;
    return this.httpClient.post<IEnrollmentModel>(url, enrollment, {observe: 'response', reportProgress: true});
  }

  update(enrollment: IEnrollmentModel): Observable<HttpResponse<IEnrollmentModel>> {
    const url = `${environment.api.url}enrollment/${enrollment.id}`;
    return this.httpClient.put<IEnrollmentModel>(url, enrollment, {observe: 'response', reportProgress: true});
  }

  delete(enrollment: IEnrollmentModel) {
    let body = null;
    const localStorageKey = localStorage.getItem('editKeyByKeyDialog');
    if (localStorageKey !== null) {
      body = {key: localStorageKey};
    }

    localStorage.removeItem('editKeyByKeyDialog');

    const req = new HttpRequest('DELETE', `${environment.api.url}enrollment/${enrollment.id}`, body, {});
    return this.httpClient.request(req);
  }

  allowEdit(enrollment: IEnrollmentModel): Observable<HttpResponse<void>> {
    const url = `${environment.api.url}enrollment/${enrollment.id}/allowEdit`;
    return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
  }

  validateKey(enrollment: IEnrollmentModel, key: string): Observable<HttpResponse<void>> {
    const url = `${environment.api.url}enrollment/${enrollment.id}/validateKey`;
    return this.httpClient.post<void>(url, {key}, {observe: 'response', reportProgress: true});
  }
}
