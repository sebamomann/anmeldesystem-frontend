import { LinkDataComponent } from './../form/link-data/link-data.component';
import { AdditionsComponent } from './../form/additions/additions.component';
import { OverallDataComponent } from './../form/overall-data/overall-data.component';
import { Component, ElementRef, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocomplete, MatDialog, MatStepper } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentService } from '../../../services/appointment.service';
import { Router } from '@angular/router';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss']
})
export class AppointmentCreateComponent implements OnInit {

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  @ViewChild('overalldata', { static: true }) overallDataRef: OverallDataComponent;
  @ViewChild('additiondata', { static: true }) additionDataRef: AdditionsComponent;
  @ViewChild('linkdata', { static: true }) linkDataRef: LinkDataComponent;

  // FormGroups
  doneGroup: any;

  public output: any = {};
  public percentDone = 0;
  public stepValid = [false, false, false];

  public sendingRequestEmit = new EventEmitter()

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog, private appointmentService: AppointmentService,
    private router: Router) {

    this.doneGroup = this.formBuilder.group({
      saveAsTemplate: new FormControl()
    });
  }

  ngOnInit() {
  }

  // Dialogs
  // public _openAppointmentTemplateDialog: () => void = () => {
  //   const dialogRef = this.dialog.open(TemplateDialogComponent, {
  //     width: '90%',
  //     maxWidth: '500px',
  //     height: 'auto',
  //     maxHeight: '80vh',
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (isObject(result)) {
  // this.overallDataFormGroup.get('title').setValue(result.title);
  // this.overallDataFormGroup.get('location').setValue(result.location);
  // this.overallDataFormGroup.get('maxEnrollments').setValue(result.maxEnrollments);
  //
  // this.linkFormGroup.get('description').setValue(result.description);
  // result.additions.forEach(addition => {
  //   // add additions
  // });
  //
  // this.getDriverAddition().setValue(result.driverAddition);
  //     }
  //   });
  // };


  async create(event) {
    event.preventDefault();
    this.sendingRequestEmit.emit(true);
    this.output.administrators = [];
    this.output.files = [];

    this.appointmentService
      .create(this.output)
      .subscribe(
        result => {
          this.router.navigate([`enroll`], {
            queryParams: {
              a: result.link
            }
          }).then(() => {
            this.sendingRequestEmit.emit(false);
          });
        },
        (err: HttpErrorResponse) => {
          this.sendingRequestEmit.emit(false);
          this.percentDone = 0;
          if (err.status === HttpStatus.CONFLICT) {
            if (err.error.code === 'DUPLICATE_VALUES') {
              err.error.data.forEach(dat => {
                const indexMapping = {
                  undefined: {
                    "link": {
                      index: 2,
                      ref: this.linkDataRef,
                      value: "link"
                    },
                    "deadline": {
                      index: 0,
                      ref: this.overallDataRef,
                      value: "deadline"
                    },
                  },
                  "addition": {
                    "name": {
                      index: 1,
                      ref: this.additionDataRef,
                      value: "addition"
                    }
                  }
                }


                const mapping = indexMapping[dat.object][dat.attribute];
                this.stepper.selectedIndex = mapping.index;

                mapping.ref.get(mapping.value).setErrors({ inUse: true })
              }
              );
            }
          }
        }
      );
  }

  getOverallData(data: any) {
    this.stepValid[0] = true;
    this.output.title = data.title;
    this.output.date = data.date;
    this.output.deadline = data.deadline;
    this.output.location = data.location;
    this.output.maxEnrollments = data.maxEnrollments;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  getAdditions(data: any) {
    this.stepValid[1] = true;
    this.output.driverAddition = data.driverAddition;
    this.output.additions = data.additions;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  getLinkData(data: any) {
    this.stepValid[2] = true;
    this.output.link = data.link;
    this.output.description = data.description;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  back() {
    this.stepper.previous();
  }
}
