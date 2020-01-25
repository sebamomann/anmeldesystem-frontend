import {Injectable} from '@angular/core';
import {IAppointmentModel} from './models/IAppointment.model';

@Injectable()
export class Globals {
  appointments: IAppointmentModel[] = [];
}
