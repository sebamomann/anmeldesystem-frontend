import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IAppointmentModel } from '../../../../models/IAppointment.model';
import { AppointmentService } from '../../../../services/appointment.service';
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-file-delete',
  templateUrl: './file-delete.component.html',
  styleUrls: ['./file-delete.component.scss']
})
export class FileDeleteComponent implements OnInit {

  @Input()
  file: { name: string, id: string };
  @Output()
  private deleted = new EventEmitter<any>();
  @Input()
  appointment: IAppointmentModel;
  public icon: string;
  @ViewChild('fileRef', { static: false })
  private elementReference: ElementRef;
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
        .removeFile(this.file.id, this.appointment)
        .subscribe(
          () => {
            this.deleted.emit(this.file);
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
