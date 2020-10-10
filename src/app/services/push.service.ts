import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {SwPush} from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  readonly VAPID_PUBLIC_KEY = environment.VAPID_KEY;

  constructor(private httpClient: HttpClient, private swPush: SwPush) {
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
      serverPublicKey: 'BKEcHfrBBEI416Dl0rJa-f5ctf_jvZ9zbBSzkGMKwpH7P4a62_ScOPjzbAE11zIsrBmVNOJ-CuX6fR7PtrkpAZM'
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
