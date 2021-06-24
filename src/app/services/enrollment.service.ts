import {Inject, Injectable} from '@angular/core';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IAppointmentModel} from '../models/IAppointment.model';
import {Observable} from 'rxjs';
import {WINDOW} from '../provider/window.provider';
import {TokenUtil} from '../_util/tokenUtil.util';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private readonly httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }

  create(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<IEnrollmentModel> {
    const _enrollment: any = enrollment;
    _enrollment.domain = `${this.window.location.hostname}/enrollment?a=${appointment.link}&e={{0}}&t={{1}}`;
    _enrollment.appointment = {link: appointment.link};
    const url = `${environment.API_URL}enrollments`;

    return this.httpClient.post<IEnrollmentModel>(url, _enrollment);
  }

  update(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<IEnrollmentModel> {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, appointment.link);

    let headers;
    if (token) {
      headers = {'x-enrollment-token': token};
    }

    const url = `${environment.API_URL}enrollments/${enrollment.id}`;

    return this.httpClient.put<IEnrollmentModel>(url, enrollment, {headers});
  }

  delete(enrollment: IEnrollmentModel, link) {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, link);

    let headers;
    if (token) {
      headers = {'x-enrollment-token': token};
    }

    return this.httpClient.delete<void>(`${environment.API_URL}enrollments/${enrollment.id}`, {
      observe: 'response',
      reportProgress: true,
      headers
    });
  }

  checkPermission(enrollment: IEnrollmentModel, link: string = '') {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, link);
    const url = `${environment.API_URL}enrollments/${enrollment.id}/check-permission`;
    let headers;
    if (token) {
      headers = {'x-enrollment-token': token};
    }
    return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true, headers});
  }
}
