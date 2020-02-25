import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentModel} from '../../../../models/IAppointment.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
      link: new FormControl(''),
      description: new FormControl('', [Validators.minLength(10)])
    });

    if (this.appointment !== undefined) {
      this.parseIntoForm();
    }
  }

  private parseIntoForm() {
    this.event.setValue({
      link: this.appointment.link,
      description: this.appointment.description,
    });

    this.checkLink();
  }

  public saveFnc() {
    if (this.get('description').value.length > 10 && !this.get('link').hasError('inUse')) {
      const data = {
        link: this.get('link').value,
        description: this.get('description').value,
      };

      this.save.emit(data);
    }
  }

  getLinkErrorMessage(): string {
    if (this.get('link').hasError('inUse')) {
      return 'Dieser Link ist leider schon in Benutzung';
    } else if (this.get('link').hasError('new')) {
      return 'Beachte, dein alter Link wird sofort ungültig';
    }
  }

  getDescriptionErrorMessage() {
    return 'Mindestens 10 Zeichen notwendig';
  }

  private checkLink() {
    if (this.appointment !== undefined
      && this.get('link').value !== this.appointment.link) {
      this.get('link').setErrors({new: true});
      this.get('link').markAsTouched();
    }
  }

  private get(str: string) {
    return this.event.get(str);
  }
}
