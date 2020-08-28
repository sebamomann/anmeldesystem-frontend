import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';
import {IAppointmentTemplateModel} from '../models/IAppointmentTemplateModel.model';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CreateAppointmentModel} from '../models/createAppointment.model';
import {environment} from '../../environments/environment';
import {Globals} from '../globals';
import {catchError, map} from 'rxjs/operators';
import {AppointmentUtil} from '../_util/appointmentUtil.util';
import {AppointmentStatus} from '../components/termin/appointment.status';

const REFRESH_INTERVAL = 30000;
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private globals: Globals;

  // CACHING
  private lastFetched: string;
  private etag = {current: '', last: ''};


  constructor(private readonly httpClient: HttpClient, private glob: Globals, private appointmentStatus: AppointmentStatus) {
    this.globals = glob;
  }

  public getAppointment(link: string, slim: boolean): Observable<IAppointmentModel> {
    this.appointmentStatus.updating = true;

    let url = `${environment.API_URL}appointment/${link}`;

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

    this.appointmentStatus.updating = false;

    return res.pipe(
      map(response => {
        this.etag.last = this.etag.current;
        this.etag.current = response.headers.get('etag');
        return response.body as IAppointmentModel;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  getAppointments(slim: boolean, before, limit): Observable<IAppointmentModel[]> {
    let url = `${environment.API_URL}appointment/`;

    url = `${url}?slim=${slim}&before=${before}&limit=${limit}`;

    const pinned = AppointmentUtil.getPinned();
    let pinnedQueryParam = '?';
    if (slim) {
      pinnedQueryParam = '&';
    }

    pinned.forEach((fPin, i) => {
      pinnedQueryParam += 'pin' + (i + 1) + '=' + fPin + '&';
    });
    url += pinnedQueryParam;

    const res = this.httpClient.get(url, {observe: 'response', reportProgress: true});

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
    const req = new HttpRequest('PUT', `${environment.API_URL}appointment/${link}`, toChange, {
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
    const req = new HttpRequest('POST', `${environment.API_URL}appointment`, appointment, {
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
    const req = new HttpRequest('POST', `${environment.API_URL}appointment/${appointment.link}/administrator`,
      {username: adminUsername},
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  removeAdministration(admin: any, appointment: IAppointmentModel): Observable<HttpEvent<void>> {
    const req = new HttpRequest('DELETE',
      `${environment.API_URL}appointment/${appointment.link}/administrator/${admin.username}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  addFile(data: any, appointment: IAppointmentModel) {
    const req = new HttpRequest('POST',
      `${environment.API_URL}appointment/${appointment.link}/file`,
      data,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  removeFile(fileId: string, appointment: IAppointmentModel) {
    const req = new HttpRequest('DELETE',
      `${environment.API_URL}appointment/${appointment.link}/file/${fileId}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  async hasPermission(link: any) {
    const req = new HttpRequest('GET',
      `${environment.API_URL}appointment/${link}/permission/`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  pin(link: string) {
    const url = `${environment.API_URL}appointment/${link}/pin`;
    const req = new HttpRequest('GET', url, {
      observe: 'response',
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
