import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {IUserModel} from '../models/IUserModel.model';
import {Router, RouterStateSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<any>;
  private currentUserSubject: BehaviorSubject<any>;
  private snapshot: RouterStateSnapshot;

  constructor(private _http: HttpClient, private _router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.snapshot = _router.routerState.snapshot;
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(mail, password) {
    return this._http.post<any>(`${environment.api.url}auth/login`, {username: mail, password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // tslint:disable-next-line:prefer-const
        let oldDateObj = new Date();
        const newDateObj = new Date();
        newDateObj.setTime(oldDateObj.getTime() + (23 * 60 * 60 * 1000));
        user.exp = newDateObj;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setCurrentUser(user: IUserModel) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(this.currentUserValue));
  }

  check = (state: RouterStateSnapshot): boolean => {
    if (this.currentUserValue && this.currentUserValue.exp > new Date()) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      if (this.currentUserValue !== null) {
        this._router.navigate(['/account/login'], {
          queryParams: {
            returnUrl: state.url,
            mail: this.currentUserValue.mail
          }
        })
          .then(() => {
            return false;
          });
      }

      this._router.navigate(['/account/login'], {
        queryParams: {
          returnUrl: state.url
        }
      });
      return false;
    }
  };
}
