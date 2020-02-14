import {Injectable} from '@angular/core';

@Injectable()
export class ValidatorService {
  constructor() {
  }

  emailIsValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
}
