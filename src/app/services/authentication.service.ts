import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {IUserModel} from '../models/IUserModel.model';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<any>;
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(mail, password) {
    return this.http.post<any>(`${environment.api.url}auth/login`, {username: mail, password})
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
}
