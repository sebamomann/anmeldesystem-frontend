import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TerminService} from '../../../services/termin.service';
import {Location} from '@angular/common';
import {of} from 'rxjs';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {
  event: FormGroup;
  appointment: any;
  additions = [];
  ordersData = [];

  constructor(private terminService: TerminService, private location: Location, private formBuilder: FormBuilder) {
    this.event = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.min(2)]),
      comment: new FormControl('', [Validators.required, Validators.min(2)]),
      additions: new FormArray([]),
      orders: new FormArray([]),
      driver: new FormControl(false),
      seats: new FormControl('', [Validators.min(1)]),
      requirementService: new FormControl('', [])
    });


    // this.appointment = of(this.terminService.getTermin('')).pipe(map(o => JSON.stringify(o)));
    of(this.getAppointment()).subscribe(appointment => {
      this.appointment = appointment;
      this.addCheckboxes();
    });
  }

  private getAppointment() {
    return this.terminService.getTermin('');
  }

  private addCheckboxes() {
    this.appointment.additions.forEach((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.event.controls.additions as FormArray).push(control);
    });
  }

  ngOnInit() {
  }

  create(): void {
    const selectedOrderIds = this.event.value.additions
      .map((v, i) => v ? this.appointment.additions[i].id : null)
      .filter(v => v !== null);
    console.log(selectedOrderIds);
  }

  getUsernameErrorMessage(): string {
    if (this.getUsername().hasError('required')) {
      return 'Bitte gebe einen Benutezrnamen an';
    }

    if (this.getUsername().hasError('inUse')) {
      return 'Dieser Benutzername ist bereits vergeben';
    }
  }

  getEmailErrorMessage(): string {
    if (this.getEmail().hasError('required')) {
      return 'Bitte gebe eine Email-Adresse an';
    }

    if (this.getEmail().hasError('email')) {
      return 'Diese Email-Adresse hat kein gültiges Format';
    }

    if (this.getEmail().hasError('inUse')) {
      return 'Diese Email wird bereits verwendet';
    }
  }

  private getUsername() {
    return this.event.get('username');
  }

  private getEmail() {
    return this.event.get('email');
  }

  getNameErrorMessage() {
    return '';
  }

  getSeatsErrorMessage() {
    return '';
  }

  goBack() {
    this.location.back();
  }
}
