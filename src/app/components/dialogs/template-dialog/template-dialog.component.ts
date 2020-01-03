import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {IAppointmentTemplateModel} from '../../../models/IAppointmentTemplateModel.model';

@Component({
  selector: 'app-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {

  public templates: IAppointmentTemplateModel[];

  constructor(private appointmentService: AppointmentService) {
    this.templates = this.appointmentService.getTemplates();
  }

  ngOnInit() {
  }

}
