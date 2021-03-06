import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AppointmentService} from '../../../../services/appointment.service';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-administrator-delete',
  templateUrl: './administrator-delete.component.html',
  styleUrls: ['./administrator-delete.component.scss']
})
export class AdministratorDeleteComponent implements OnInit {

  @ViewChild('adminRef', {static: false})
  private elementReference: ElementRef;
  @Output()
  private deleted = new EventEmitter<any>();
  @Input()
  admin: any;
  @Input()
  appointment: IAppointmentModel;
  public icon: string;
  private timer: Timer;

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.icon = this.getStartIcon();
    this.timer = null;
  }

  public initializeDelete() {
    if (this.timer === null) {
      this.runDeleteTimer();
    } else {
      this.cancelDeleteTimer();
    }
  }

  public runDeleteTimer() {
    this.icon = 'settings_backup_restore';
    this.timer = setTimeout(() => {
      this.appointmentService
        .removeAdministration(this.admin, this.appointment)
        .subscribe(
          () => {
            this.deleted.emit(this.admin);
            this.elementReference.nativeElement.remove();
          },
          () => {

          });
    }, 3000);
  }

  public cancelDeleteTimer() {
    clearTimeout(this.timer);
    this.timer = null;
    this.icon = this.getStartIcon();
  }

  public getStartIcon() {
    return 'delete';
  }
}
