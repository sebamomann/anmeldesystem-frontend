import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IAppointmentModel} from '../../models/IAppointment.model';
import {AppointmentService} from '../../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentProvider {

  constructor(private appointmentService: AppointmentService) {
  }

  private _appointment$: BehaviorSubject<IAppointmentModel> = new BehaviorSubject<IAppointmentModel>(undefined);

  public get appointment$(): BehaviorSubject<IAppointmentModel> {
    return this._appointment$;
  }

  private _appointments$: BehaviorSubject<IAppointmentModel[]> = new BehaviorSubject<IAppointmentModel[]>(undefined);

  public get appointments$(): BehaviorSubject<IAppointmentModel[]> {
    return this._appointments$;
  }

  public update(appointment: IAppointmentModel) {
    this._appointment$.next(appointment);
  }

  public reset() {
    this._appointment$ = new BehaviorSubject<IAppointmentModel>(undefined);
  }

  public hasValue() {
    return this._appointment$.value;
  }

  public loadAppointments() {
    this.appointmentService
      .getAppointments(true)
      .subscribe(
        (result: IAppointmentModel[]) => {
          this._appointments$.next(result);
        }
      );
  }
}
