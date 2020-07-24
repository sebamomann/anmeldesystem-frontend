import {Inject, Injectable} from '@angular/core';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IAppointmentModel} from '../models/IAppointment.model';
import {Observable, throwError} from 'rxjs';
import {WINDOW} from '../provider/window.provider';
import {TokenUtil} from '../_util/tokenUtil.util';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private readonly httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }

  create(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<HttpResponse<IEnrollmentModel>> {
    const _enrollment: any = enrollment;
    _enrollment.domain = `${this.window.location.hostname}/enrollment?a=${appointment.link}&e={{0}}&t={{1}}`;
    _enrollment.appointment = {link: appointment.link};
    const url = `${environment.API_URL}enrollment?asquery=true`;
    return this.httpClient.post<IEnrollmentModel>(url, _enrollment, {observe: 'response', reportProgress: true});
  }

  update(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<HttpResponse<IEnrollmentModel>> {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, appointment.link);
    const url = `${environment.API_URL}enrollment/${enrollment.id}/${token}`;
    return this.httpClient.put<IEnrollmentModel>(url, enrollment, {observe: 'response', reportProgress: true});
  }

  delete(enrollment: IEnrollmentModel, link) {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, link);
    return this.httpClient.delete<void>(`${environment.API_URL}enrollment/${enrollment.id}/${token}`, {
      observe: 'response',
      reportProgress: true
    });
  }

  allowEdit(enrollment: IEnrollmentModel): Observable<HttpResponse<void>> {
    const url = `${environment.API_URL}enrollment/${enrollment.id}/allowEdit`;
    return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
  }

  validateToken(enrollment: IEnrollmentModel, link): Observable<HttpResponse<void>> {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, link);
    if (token !== undefined && token !== '') {
      const url = `${environment.API_URL}enrollment/${enrollment.id}/validateToken/${token}`;
      return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
    } else {
      return throwError('');
    }
  }

  checkPermission(enrollment: IEnrollmentModel, link: string = '') {
    const token = TokenUtil.getTokenForEnrollment(enrollment.id, link);
    const url = `${environment.API_URL}enrollment/${enrollment.id}/check-permission?token=${token}`;
    return this.httpClient.get<void>(url, {observe: 'response', reportProgress: true});
  }
}
