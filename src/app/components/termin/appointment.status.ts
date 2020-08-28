import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentStatus {

  constructor() {
  }

  public _updating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get updating$(): BehaviorSubject<boolean> {
    return this._updating$;
  }

  public set updating(value: boolean) {
    this._updating$.next(value);
  }
}
