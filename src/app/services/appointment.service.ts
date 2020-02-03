import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';
import {IAppointmentTemplateModel} from '../models/IAppointmentTemplateModel.model';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable, Subject, timer} from 'rxjs';
import {CreateAppointmentModel} from '../models/createAppointment.model';
import {environment} from '../../environments/environment';
import {Globals} from '../globals';
import {map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';

const REFRESH_INTERVAL = 10000;
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private globals: Globals;

  // CACHING
  private lastFetched: string;
  private cache$: Observable<IAppointmentModel>;
  private reload$ = new Subject<void>();


  constructor(private readonly httpClient: HttpClient, private glob: Globals) {
    this.globals = glob;
  }

  getAppointment(link: string, slim: boolean = false) {
    if (!this.cache$ || this.lastFetched !== link) {
      this.lastFetched = link;
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);

      // For each timer tick make an http request to fetch new data
      // We use shareReplay(X) to multicast the cache so that all
      // subscribers share one underlying source and don't re-create
      // the source over and over again. We use takeUntil to complete
      // this stream when the user forces an update.
      this.cache$ = timer$.pipe(
        switchMap(() => this.requestAppointment(link, slim)),
        takeUntil(this.reload$),
        shareReplay(CACHE_SIZE)
      );
    }

    return this.cache$;
  }

  forceReload() {
    this.reload$.next();
    this.cache$ = null;
  }

  requestAppointment(link: string, slim: boolean) {
    let url;
    let req;
    // if (this.getFromCache(link) !== undefined && this.getFromCache(link) !== null) {
    //   url = `${environment.api.url}appointment/newcontent/${link}`;
    //
    //   req = new HttpRequest('POST', url, {lastUpdated: new Date()}, {
    //     reportProgress: true,
    //   });
    //
    // } else {
    url = `${environment.api.url}appointment/${link}`;
    if (slim) {
      url += '?slim=true';
    }

    req = new HttpRequest('GET', url, {
      observe: 'response',
      reportProgress: true,
    });
    // }

    return this.httpClient.request(req).pipe(
      // @ts-ignore
      map(response => response.body)
    );
  }

  getAppointments(slim: boolean = false): Observable<HttpEvent<IAppointmentModel[]>> {
    let url = `${environment.api.url}appointment/`;
    if (slim) {
      url = url + '?slim=true';
    }
    const req = new HttpRequest('GET', url, {
      observe: 'response',
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
    const req = new HttpRequest('POST', `${environment.api.url}appointment`, appointment, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
    // return this.httpClient.post<IAppointmentModel>(`${environment.api.url}appointment`, appointment,
    //   {
    //     observe: 'response',
    //     reportProgress: true
    //   }
    // );
  }

  // enroll(enrollment: IEnrollmentModel, appointment: IAppointmentModel): Observable<HttpEvent<IEnrollmentModel>> {
  //   const url = `${environment.api.url}enrollment?link=${appointment.link}`;
  //   const req = new HttpRequest('POST', url, enrollment, {
  //     reportProgress: true,
  //   });
  //   return this.httpClient.request(req);
  //   // return this.httpClient.post<any>(url, enrollment, {observe: 'response'});
  // }
}
