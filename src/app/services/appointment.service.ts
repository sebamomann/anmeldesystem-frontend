import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';
import {IAppointmentTemplateModel} from '../models/IAppointmentTemplateModel.model';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, merge, Observable, of, Subject, timer} from 'rxjs';
import {CreateAppointmentModel} from '../models/createAppointment.model';
import {environment} from '../../environments/environment';
import {Globals} from '../globals';
import {map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';
import {AppointmentUtil} from '../_util/appointmentUtil.util';

const REFRESH_INTERVAL = 30000;
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
  private clear$ = new Subject<void>();
  private hasUpdate$: BehaviorSubject<boolean>;
  private etag = {current: '', last: ''};
  private first: boolean;
  private timerActive: boolean;


  constructor(private readonly httpClient: HttpClient, private glob: Globals) {
    this.globals = glob;
  }

  getAppointment(link: string, restart: boolean, slim: boolean = false) {
    if (!this.cache$ || this.lastFetched !== link || (!this.timerActive && restart)) {
      this.clear$.next();
      this.lastFetched = link;
      this.hasUpdate$ = new BehaviorSubject<boolean>(false);

      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);

      // For each timer tick make an http request to fetch new data
      // We use shareReplay(X) to multicast the cache so that all
      // subscribers share one underlying source and don't re-create
      // the source over and over again. We use takeUntil to complete
      // this stream when the user forces an update.
      this.first = true;

      const cacheNew$ = timer$.pipe(
        switchMap(() => this.requestAppointment(link, slim)),
        takeUntil(this.clear$),
        shareReplay(CACHE_SIZE)
      );

      if (restart && this.timerActive) {
        this.cache$ = merge(this.cache$, cacheNew$);
      } else {
        this.cache$ = cacheNew$;
      }
    }

    this.timerActive = true;

    return this.cache$;
  }

  clear() {
    this.clear$.next();
    this.timerActive = false;
  }

  updateAvailable(): Observable<boolean> {
    return this.hasUpdate$.asObservable();
  }

  manualUpdate() {
    this.clear$.next();
  }

  resetAvailableUpdate() {
    this.hasUpdate$.next(false);
  }

  forceReload() {
    this.reload$.next();
    this.cache$ = null;
  }

  requestAppointment(link: string, slim: boolean): Observable<IAppointmentModel> {
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

    let headers = new HttpHeaders();
    if (this.first) {
      headers = new HttpHeaders({
        'If-None-Match': ''
      });
    }

    req = new HttpRequest('GET', url, {
      observe: 'response',
      reportProgress: true,
      headers
    });

    const resp = this.httpClient.request(req);


    const res = this.httpClient.get(url, {headers, observe: 'response'});
    res.toPromise().then(response => {
      this.etag.last = this.etag.current;
      this.etag.current = response.headers.get('etag');
      if (this.etag.last !== this.etag.current && !this.first) {
        this.hasUpdate$.next(true);
      }

      this.first = false;
    }, err => {
      return of(undefined);
    });


    return res.pipe(
      map(response => response.body as IAppointmentModel)
    );

    // const res = this.httpClient.get(url, {headers, observe: 'response'})
    //   .subscribe(response => {
    //     if (response.type === HttpEventType.Response) {
    //       console.log('...', response);
    //       this.etag.last = this.etag.current;
    //       this.etag.current = response.headers.get('etag');
    //       if (this.etag.last !== this.etag.current && !this.first) {
    //         this.hasUpdate$.next(true);
    //       }
    //
    //       this.first = false;
    //
    //       return res.pipe(
    //         map(_response => _response as IAppointmentModel)
    //       );
    //     }
    //   }, err => {
    //   });
  }

  getAppointments(slim: boolean = false): Observable<HttpEvent<IAppointmentModel[]>> {
    let url = `${environment.api.url}appointment/`;
    if (slim) {
      url = url + '?slim=true';
    }

    const pinned = AppointmentUtil.getPinned();
    let pinnedQueryParam = '?';
    if (slim) {
      pinnedQueryParam = '&';
    }

    pinned.forEach((fPin, i) => {
      pinnedQueryParam += 'pin' + (i + 1) + '=' + fPin + '&';
    });
    url += pinnedQueryParam;

    console.log(url);

    const req = new HttpRequest('GET', url, {
      observe: 'response',
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }

  updateValues(toChange: {}, {link}): Observable<HttpEvent<IAppointmentModel>> {
    console.log('update appointment', toChange);
    const req = new HttpRequest('PUT', `${environment.api.url}appointment/${link}`, toChange, {
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
  addAdministrator(adminUsername: string, appointment: IAppointmentModel): Observable<HttpEvent<void>> {
    const req = new HttpRequest('POST', `${environment.api.url}appointment/${appointment.link}/administrator`,
      {username: adminUsername},
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  removeAdministration(admin: any, appointment: IAppointmentModel): Observable<HttpEvent<void>> {
    const req = new HttpRequest('DELETE',
      `${environment.api.url}appointment/${appointment.link}/administrator/${admin.username}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  addFile(data: any, appointment: IAppointmentModel) {
    const req = new HttpRequest('POST',
      `${environment.api.url}appointment/${appointment.link}/file`,
      data,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  removeFile(fileId: string, appointment: IAppointmentModel) {
    const req = new HttpRequest('DELETE',
      `${environment.api.url}appointment/${appointment.link}/file/${fileId}`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  async hasPermission(link: any) {
    console.log('checkPermission');

    const req = new HttpRequest('GET',
      `${environment.api.url}appointment/${link}/permission/`,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  pin(link: string) {
    const url = `${environment.api.url}appointment/${link}/pin`;
    const req = new HttpRequest('GET', url, {
      observe: 'response',
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }
}
