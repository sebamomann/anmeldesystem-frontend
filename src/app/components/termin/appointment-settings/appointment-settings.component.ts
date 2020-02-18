import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../../services/appointment.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {EnrollmentService} from '../../../services/enrollment.service';
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {IAppointmentModel} from '../../../models/IAppointment.model';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit {
  private link: any;
  private appointment: IAppointmentModel;
  private overallDataFormGroup: any;
  private additionFormGroup: any;


  constructor(private appointmentService: AppointmentService, public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private authenticationService: AuthenticationService, private enrollmentService: EnrollmentService,
              private snackBar: MatSnackBar, private location: Location, private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.link = params.a;
    });

    this.route.params.subscribe(params => {
      if (params.link !== undefined) {
        this.link = params.link;
        this.router.navigate(['/enroll'], {queryParams: {a: this.link}}).then(() => '');
      }
    });

    this.overallDataFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      deadline: [''],
      location: ['', Validators.required],
      maxEnrollments: [''],
    });

    this.additionFormGroup = this.formBuilder.group({
      additions: new FormArray([new FormControl()]),
      driverAddition: [false]
    });
  }

  ngOnInit() {
    this.appointmentService
      .getAppointment(this.link, false)
      .subscribe(sAppointment => {
        this.appointment = sAppointment;

        this.parseDataIntoForms();
      });
  }

  addAdditionFormControlToFormArray(value: string | null = null) {
    return (this.additionFormGroup.controls.additions as FormArray).push(new FormControl(value));
  }

  removeAdditionFromFormArray(index: number) {
    this.additionFormGroup.controls.additions.removeAt(index);
  }

  public privateGetOverall(str: string) {
    return this.overallDataFormGroup.get(str);
  }

  private parseDataIntoForms() {
    this.parseOverallData();
    this.parseAdditionData();
  }

  private parseOverallData() {
    this.overallDataFormGroup.setValue({
      title: this.appointment.title,
      date: this.appointment.date,
      deadline: this.appointment.deadline,
      location: this.appointment.location,
      maxEnrollments: this.appointment.maxEnrollments
    });
  }

  private parseAdditionData() {
    this.appointment.additions.forEach(fAddition => {
      this.addAdditionFormControlToFormArray(fAddition.name);
    });

    this.additionFormGroup.get('driverAddition').setValue(this.appointment.driverAddition);
  }
}
