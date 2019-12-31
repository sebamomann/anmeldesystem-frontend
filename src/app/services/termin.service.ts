import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';
import {IAppointmentTemplateModel} from '../models/IAppointmentTemplateModel.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateAppointmentModel} from '../models/createAppointment.model';
import {IEnrollmentModel} from '../models/IEnrollment.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getAppointment(link: string): Observable<HttpResponse<IAppointmentModel | any>> {
    return this.httpClient.get<IAppointmentModel>(`${environment.api.url}appointment/${link}`, {observe: 'response'});
  }

  getTermine(): Observable<IAppointmentModel[]> {
    return this.httpClient.get<IAppointmentModel[]>(`${environment.api.url}appointment`);
  }

  getTemplates(): IAppointmentTemplateModel[] {
    return [
      {
        title: 'Template 1',
        description: 'Template description',
        location: 'Template location',
        maxEnrollments: 20,
        additions: [{name: 'Template Addition 1'}],
        driverAddition: true
      },
      {
        title: 'Template 2',
        description: 'Template 2 description',
        location: 'Template 2 location',
        maxEnrollments: 20,
        additions: [{name: 'Template Addition 2'}],
        driverAddition: true
      }
    ];
  }

  create(appointment: CreateAppointmentModel): Observable<HttpResponse<IAppointmentModel | any>> {
    return this.httpClient.post<IAppointmentModel>(`${environment.api.url}appointment`, appointment, {observe: 'response'});
  }

  enroll(enrollment: IEnrollmentModel, appointment: IAppointmentModel) {
    const url = `${environment.api.url}enrollment?link=${appointment.link}`;
    return this.httpClient.post<IEnrollmentModel>(url, enrollment, {observe: 'response'});
  }
}
