import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  login(userCredentials: {password: any; username: any}) {
    return undefined;
  }
}
