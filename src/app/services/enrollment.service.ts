import {Inject, Injectable} from '@angular/core';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IAppointmentModel} from '../models/IAppointment.model';
import {Observable} from 'rxjs';
import {WINDOW} from '../provider/window.provider';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private readonly httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }

  create(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<HttpResponse<IEnrollmentModel>> {
    const _enrollment: any = enrollment;
    _enrollment.domain = this.window.location.hostname + '/enrollment?a=' + appointment.link;
    const url = `${environment.api.url}enrollment?link=${appointment.link}&asquery=true`;
    return this.httpClient.post<IEnrollmentModel>(url, _enrollment, {observe: 'response', reportProgress: true});
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

  validateToken(enrollment: IEnrollmentModel, link): Observable<HttpResponse<void>> {
    const token = this.getTokenForEnrollment(enrollment.id, link);
    if (token !== '') {
      const url = `${environment.api.url}enrollment/${enrollment.id}/validateToken/${token}`;
      return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
    } else {
      throw new Error();
    }
  }

  private getTokenForEnrollment(id: string, link: string) {
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const linkElem = permissions.find(fElement => fElement.link === link);
    const elem = linkElem.enrollments.filter(sPermission => sPermission.id === id);
    if (elem !== undefined) {
      return elem[0].token;
    } else {
      return '';
    }
  }
}
