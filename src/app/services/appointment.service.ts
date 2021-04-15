import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';
import {IAppointmentTemplateModel} from '../models/IAppointmentTemplateModel.model';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CreateAppointmentModel} from '../models/createAppointment.model';
import {environment} from '../../environments/environment';
import {catchError, finalize, map} from 'rxjs/operators';
import {AppointmentUtil} from '../_util/appointmentUtil.util';
import {AppointmentStatus} from '../components/termin/appointment.status';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  // CACHING
  private etag = {current: '', last: ''};


  constructor(private readonly httpClient: HttpClient, private appointmentStatus: AppointmentStatus) {
  }

  public getAppointment(link: string, slim: boolean): Observable<IAppointmentModel> {
    this.appointmentStatus.updating = true;

    let url = `${environment.API_URL}appointments/${link}`;

    if (slim) {
      url = url + '?slim=true';
    }

    // IF HIDDEN ONLY
    let pinnedQueryParam = '?';
    if (slim) {
      pinnedQueryParam = '&';
    }

    let permissions = JSON.parse(localStorage.getItem('permissions'));
    if (permissions !== null) {
      permissions = permissions.find(fPermission => fPermission.link === link);

      if (permissions !== undefined) {
        permissions.enrollments.forEach((fPermission, i) => {
          pinnedQueryParam += 'perm' + (i + 1) + '=' + fPermission.id + '&token' + (i + 1) + '=' + fPermission.token + '&';
        });

        url += pinnedQueryParam;
      }
    }

    const res = this.httpClient.get(url, {observe: 'response'});

    return res.pipe(
      map(response => {
        this.etag.last = this.etag.current;
        this.etag.current = response.headers.get('etag');
        return response.body as IAppointmentModel;
      }),
      catchError(() => {
        return of(null);
      }),
      finalize(() => {
        this.appointmentStatus.updating = false;
      })
    );
  }

  public getAppointments(slim: boolean, before: Date, after: Date, limit: number): Observable<IAppointmentModel[]> {
    let url = `${environment.API_URL}appointments/`;

    const params = new URLSearchParams({
      slim: slim ? 'true' : 'false'
    });

    if (before) {
      params.append('before', before.toISOString());
    }

    if (after) {
      params.append('after', after.toISOString());
    }

    if (limit) {
      params.append('limit', `${limit}`);
    }

    const pinned = AppointmentUtil.getPinned();

    pinned.forEach((fPin, i) => {
      params.append('pin' + (i + 1), fPin);
    });

    const res = this.httpClient.get(url + '?' + params.toString(), {observe: 'response', reportProgress: true});

    return res.pipe(
      map(response => {
        this.etag.last = this.etag.current;
        this.etag.current = response.headers.get('etag');
        return response.body as IAppointmentModel[];
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  updateValues(toChange: {}, {link}): Observable<HttpEvent<IAppointmentModel>> {
    console.log('update appointment', toChange);
    const req = new HttpRequest('PUT', `${environment.API_URL}appointments/${link}`, toChange, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
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

  create(appointment: CreateAppointmentModel): Observable<HttpEvent<IAppointmentModel>> {
    const req = new HttpRequest('POST', `${environment.API_URL}appointments`, appointment, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
    // return this.httpClient.post<IAppointmentModel>(`${environment.API_URL}appointment`, appointment,
    //   {
    //     observe: 'response',
    //     reportProgress: true
    //   }
    // );
  }

  // enroll(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<HttpEvent<IEnrollmentModel>> {
  //   const url = `${environment.API_URL}enrollment?link=${appointment.link}`;
  //   const req = new HttpRequest('POST', url, enrollment, {
  //     reportProgress: true,
  //   });
  //   return this.httpClient.request(req);
  //   // return this.httpClient.post<any>(url, enrollment, {observe: 'response'});
  // }
  addAdministrator(adminUsername: string, appointment: IAppointmentModel): Observable<HttpEvent<void>> {
    const req = new HttpRequest('POST', `${environment.API_URL}administrators`,
      {
        username: adminUsername,
        appointment: {
          link: appointment.link
        }
      },
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  removeAdministration(admin: any, appointment: IAppointmentModel): Observable<HttpEvent<void>> {
    const req = new HttpRequest('DELETE',
      `${environment.API_URL}administrators/${admin.username}?appointment=${appointment.link}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  // appointments/${appointment.link}

  addFile(data: any, appointment: IAppointmentModel) {
    const req = new HttpRequest('POST',
      `${environment.API_URL}files`,
      data,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  removeFile(fileId: string, appointment: IAppointmentModel) {
    const req = new HttpRequest('DELETE',
      `${environment.API_URL}appointments/${appointment.link}/file/${fileId}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  async getAppointmentManagementRelations(link: any) {
    const req = new HttpRequest('GET',
      `${environment.API_URL}appointments/${link}/management-relations/`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  pin(link: string) {
    const req = new HttpRequest('POST',
      `${environment.API_URL}pins`,
      {appointment: {link}},
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  unpin(link: string) {
    const req = new HttpRequest('DELETE',
      `${environment.API_URL}pins?appointment=${link}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  public hasCloseEnrollmentHint(link: string) {
    const enrollmentHintCloses: any = JSON.parse(localStorage.getItem('enrollmentHintCloses'));

    return enrollmentHintCloses && enrollmentHintCloses.indexOf(link) > -1;
  }

  public closeEnrollmentHint(link: string) {
    let enrollmentHintCloses: any = JSON.parse(localStorage.getItem('enrollmentHintCloses'));

    if (!enrollmentHintCloses) {
      enrollmentHintCloses = [];
    }

    enrollmentHintCloses.push(link);

    localStorage.setItem('enrollmentHintCloses', JSON.stringify(enrollmentHintCloses));
  }
}
