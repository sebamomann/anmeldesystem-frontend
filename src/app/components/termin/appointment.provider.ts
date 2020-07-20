import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IAppointmentModel} from '../../models/IAppointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentProvider {

  private _currentAppointment: BehaviorSubject<IAppointmentModel> = new BehaviorSubject<IAppointmentModel>(undefined);

  constructor() {
  }

  public get appointment(): BehaviorSubject<IAppointmentModel> {
    return this._currentAppointment;
  }

  public update(appointment: IAppointmentModel) {
    this._currentAppointment.next(appointment);
  }

  public reset() {
    this._currentAppointment = new BehaviorSubject<IAppointmentModel>(undefined);
  }

  public hasValue() {
    return this._currentAppointment.value;
  }
}
