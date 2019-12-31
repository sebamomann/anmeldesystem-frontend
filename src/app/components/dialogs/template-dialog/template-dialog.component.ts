import {Component, OnInit} from '@angular/core';
import {TerminService} from '../../../services/termin.service';
import {IAppointmentTemplateModel} from '../../../models/IAppointmentTemplateModel.model';

@Component({
  selector: 'app-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {

  public templates: IAppointmentTemplateModel[];

  constructor(private terminService: TerminService) {
    this.templates = this.terminService.getTemplates();
  }

  ngOnInit() {
  }

}
