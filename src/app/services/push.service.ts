import {Injectable, NgZone} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {SwPush} from '@angular/service-worker';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  readonly VAPID_PUBLIC_KEY = environment.VAPID_KEY;

  constructor(private httpClient: HttpClient, private swPush: SwPush,
              private router: Router, private ngZone: NgZone) {
    this.swPush.notificationClicks.subscribe(
      (val) => {
        if (val.action === 'openAppointment' || !val.action) {
          this.ngZone.run(() => {
            this.router.navigate(['/enroll'], {
              queryParams: {
                a: val.notification.data.link
              }
            }).then(() => '');
          });
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
      serverPublicKey: 'BKEcHfrBBEI416Dl0rJa-f5ctf_jvZ9zbBSzkGMKwpH7P4a62_ScOPjzbAE11zIsrBmVNOJ-CuX6fR7PtrkpAZM'
    })
      .then(sub => this
        .subscribeToAppointment(sub, link)
        .subscribe())
      .catch(err => {
        throw err;
      });
  }

  async unsubscribeFromAppointment(link: string): Promise<Observable<HttpEvent<any>>> {
    const prom = new Promise(resolve => {
      this.swPush.subscription.subscribe(res => {
        resolve(res.endpoint);
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
    const prom = new Promise(resolve => {
      this.swPush.subscription.subscribe(res => {
        resolve(res.endpoint);
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

  public async unsubscribeFrom(link: string) {
    if (this.swPush.isEnabled) {
      return this.swPush.requestSubscription({
        serverPublicKey: 'BKEcHfrBBEI416Dl0rJa-f5ctf_jvZ9zbBSzkGMKwpH7P4a62_ScOPjzbAE11zIsrBmVNOJ-CuX6fR7PtrkpAZM'
      })
        .then(sub => {
            const req = new HttpRequest('POST', `${environment.API_URL}push/unsubscribe`,
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
        )
        .catch(err => {
          throw err;
        });
    }
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
