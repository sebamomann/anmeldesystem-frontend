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
  public save = new EventEmitter<any>();
  @Output()
  public back = new EventEmitter<any>();
  @Input()
  public appointment: IAppointmentModel;
  @Input()
  public isEdit = false;

  public event: FormGroup;
  public sameValues = true;

  constructor(private formBuilder: FormBuilder, public urlService: UrlService) {
  }

  ngOnInit() {
    this.event = this.formBuilder.group({
      link: new FormControl(''),
      description: new FormControl('', [Validators.minLength(10)])
    });

    if (this.appointment !== undefined) {
      this.parseIntoForm();
    }

    const eventSnapshot = this.event.value;

    this.event.valueChanges.subscribe(
      result => {
        this.sameValues = JSON.stringify(result) === JSON.stringify(eventSnapshot);
      }
    );
  }

  public saveFnc() {
    if (this.get('description').value.length >= 10 && !this.get('link').hasError('inUse')) {
      const data = {
        link: this.get('link').value,
        description: this.get('description').value,
      };

      this.save.emit(data);
    }
  }

  public goBack() {
    this.back.emit();
  }

  getLinkErrorMessage(): string {
    if (this.get('link').hasError('inUse')) {
      return 'Dieser Link ist leider schon in Benutzung';
    } else if (this.get('link').hasError('new')) {
      return 'Beachte, dein alter Link wird sofort ungültig';
    }
  }

  public getDescriptionErrorMessage() {
    return 'Mindestens 10 Zeichen notwendig';
  }

  public checkLink() {
    if (this.appointment !== undefined
      && this.get('link').value !== this.appointment.link) {
      this.get('link').setErrors({new: true});
      this.get('link').markAsTouched();
    }
  }

  public updateErrors(err) {
    this.get(err.attr).setErrors({[err.error]: true});
  }

  private parseIntoForm() {
    this.event.setValue({
      link: this.appointment.link,
      description: this.appointment.description,
    });

    this.checkLink();
  }

  private get(str: string) {
    return this.event.get(str);
  }
}

