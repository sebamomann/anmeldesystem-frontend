import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';
import {IAppointmentTemplateModel} from '../models/IAppointmentTemplateModel.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateAppointmentModel} from '../models/createAppointment.model';

@Injectable({
  providedIn: 'root'
})
export class TerminService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getTermin(link: string): Observable<IAppointmentModel> {
    return this.httpClient.get<IAppointmentModel>(`http://localhost:3000/appointment/get?link=${link}`);
  }

  getTermine(): Observable<IAppointmentModel[]> {
    return this.httpClient.get<IAppointmentModel[]>(`http://localhost:3000/appointment`);
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

  create(appointment: CreateAppointmentModel) {
    return this.httpClient.post<IAppointmentModel>(`http://localhost:3000/appointment`, appointment);
  }
}
