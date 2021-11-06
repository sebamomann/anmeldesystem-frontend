import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { IAppointmentModel } from '../../models/IAppointment.model';
import { AppointmentService } from '../../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentProvider {
  private _archive: IAppointmentModel[] = [];

  constructor(private appointmentService: AppointmentService) {
    this._appointmentsArchive$ = new ReplaySubject<IAppointmentModel[]>(1);

    this._appointmentsArchive$
      .subscribe((val) => {
        this._archive = val;
      });
  }

  private _appointment$: BehaviorSubject<IAppointmentModel> = new BehaviorSubject<IAppointmentModel>(undefined);

  public get appointment$(): BehaviorSubject<IAppointmentModel> {
    return this._appointment$;
  }

  private _appointments$: BehaviorSubject<IAppointmentModel[]> = new BehaviorSubject<IAppointmentModel[]>(undefined);

  public get appointments$(): BehaviorSubject<IAppointmentModel[]> {
    return this._appointments$;
  }

  private _appointmentsArchive$: ReplaySubject<IAppointmentModel[]>;

  public get appointmentsArchive$(): ReplaySubject<IAppointmentModel[]> {
    return this._appointmentsArchive$;
  }

  public update(appointment: IAppointmentModel) {
    this._appointment$.next(appointment);
  }

  public reset() {
    this._appointment$.next(undefined);
  }

  public hasValue() {
    return this._appointment$.value;
  }

  public loadAppointments() {
    this.appointmentService
      .getAppointments(true, null, new Date(), null)
      .subscribe(
        (result: IAppointmentModel[]) => {
          this._appointments$.next(result);
        }
      );
  }

  public loadAppointmentsArchive(before, limit) {
    this.appointmentService
      .getAppointments(true, before ? new Date(before) : new Date(), null, limit)
      .subscribe(
        async (result: IAppointmentModel[]) => {
          if (result) {
            if (!this._archive) {
              this._archive = [];
            }

            result.forEach((fResult => {
              if (!this._archive.some(sAppointment => sAppointment.id === fResult.id)) {
                this._archive.push(fResult);
              }
            }));

            this._appointmentsArchive$.next(this._archive);
          }
        }
      );
  }

  loadAppointment(data: any) {
    this.appointmentService
      .getAppointment(data, false)
      .subscribe(
        (appointment: IAppointmentModel) => {
          this.update(appointment);
        }
      );
  }
}
