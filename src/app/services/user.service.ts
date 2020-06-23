import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WINDOW} from '../provider/window.provider';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
  }


}

