import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {SwPush} from '@angular/service-worker';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  readonly VAPID_PUBLIC_KEY = environment.VAPID_KEY;

  constructor(private httpClient: HttpClient, private swPush: SwPush) {
    this.swPush.notificationClicks.subscribe(
      (val) => {
        if (val.action === 'openAppointment' || !val.action) {
          window.open(`${environment.BASE_URL}enroll?a=${val.notification.data.link}`);
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
    return this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this
        .subscribeToAppointment(sub, link)
        .subscribe())
      .catch(err => {
        throw err;
      });
  }

  async unsubscribeFromAppointment(link: string): Promise<Observable<HttpEvent<any>>> {
    const prom = new Promise((resolve, reject) => {
      this.swPush.subscription.subscribe(res => {
        if (res) {
          resolve(res.endpoint);
        } else {
          reject();
        }
      });
    });

    return await prom.then((val) => {
      const url = `${environment.API_URL}push/unsubscribe`;

      const body = {
        subscription: {
          endpoint: val
        },
        appointment: {
          link
        }
      };

      const req = new HttpRequest('POST', url, body, {
        reportProgress: true
      });

      return this.httpClient.request(req);
    });
  }

  async isSubscribed(link: string): Promise<Observable<HttpEvent<any>>> {
    const prom = new Promise((resolve, reject) => {
      this.swPush.subscription.subscribe(res => {
        if (res) {
          resolve(res.endpoint);
        } else {
          reject();
        }
      });
    });

    return await prom.then((val) => {
      const url = `${environment.API_URL}push/subscription?endpoint=${val}&link=${link}`;

      const req = new HttpRequest('HEAD', url, {
        reportProgress: true
      });

      return this.httpClient.request(req);
    });
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
