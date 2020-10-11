import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {SwPush} from '@angular/service-worker';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  readonly VAPID_PUBLIC_KEY = environment.VAPID_KEY;

  constructor(private httpClient: HttpClient, private swPush: SwPush,
              private router: Router) {
    this.swPush.notificationClicks.subscribe(
      (val) => {
        if (val.action === 'openAppointment' || !val.action) {
          this.router.navigate(['/enroll'], {
            queryParams: {
              a: val.notification.data.link
            }
          }).then(() => '');
        }
      });
  }

  subscribe(sub: PushSubscription) {
    const req = new HttpRequest('POST', `${environment.API_URL}push`,
      sub,
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }

  subscribeTo(link: string) {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this
        .subscribeToAppointment(sub, link)
        .subscribe())
      .catch(err => console.error('Could not subscribe to notifications', err));
  }

  private subscribeToAppointment(sub: PushSubscription, link: string) {
    const req = new HttpRequest('POST', `${environment.API_URL}push/subscribe`,
      {
        subscription: sub,
        appointment: {
          link
        }
      },
      {
        reportProgress: true,
      });
    return this.httpClient.request(req);
  }
}
