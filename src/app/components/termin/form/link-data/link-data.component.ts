import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UrlService} from '../../../../services/url.service';

@Component({
  selector: 'app-link-data',
  templateUrl: './link-data.component.html',
  styleUrls: ['./link-data.component.scss']
})
export class LinkDataComponent implements OnInit {

  @Output()
  save = new EventEmitter<any>();
  @Input()
  private appointment: IAppointmentModel;
  @Input()
  private button = 'Speichern';

  private event: FormGroup;

  constructor(private formBuilder: FormBuilder, private urlService: UrlService) {
  }

  ngOnInit() {
    this.event = this.formBuilder.group({
      link: new FormControl(),
      description: new FormControl()
    });

    if (this.appointment !== undefined) {
      this.parseIntoForm();
    }
  }

  getLinkErrorMessage(): string {
    if (this.event.get('link').hasError('inUse')) {
      return 'Dieser Link ist leider schon in Benutzung';
    } else if (this.event.get('link').hasError('new')) {
      return 'Beachte, dein alter Link wird sofort ungültig';
    }
  }

  private parseIntoForm() {
    this.event.setValue({
      link: this.appointment.link,
      description: this.appointment.description,
    });

    this.checkLink();
  }

  private checkLink() {
    if (this.event.get('link').value !== this.appointment.link) {
      this.event.get('link').setErrors({new: true});
      this.event.get('link').markAsTouched();
    }
  }
}
