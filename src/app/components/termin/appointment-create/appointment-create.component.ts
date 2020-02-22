import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatAutocomplete, MatDialog, MatStepper} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {AppointmentService} from '../../../services/appointment.service';
import {Router} from '@angular/router';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss']
})
export class AppointmentCreateComponent implements OnInit {

  @ViewChild('stepper', null) stepper: MatStepper;
  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  // FormGroups
  doneGroup: any;

  public output: any = {};
  public percentDone = 0;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient, private sanitizer: DomSanitizer,
              public dialog: MatDialog, private appointmentService: AppointmentService,
              private router: Router) {

    this.doneGroup = this.formBuilder.group({
      saveAsTemplate: new FormControl()
    });
  }


  ngOnInit() {
  }

  async create() {
    // if (!this.overallDataFormGroup.valid ||
    //   !this.additionFormGroup.valid ||
    //   !this.linkFormGroup.valid ||
    //   !this.doneGroup.valid ||
    //   !this.administrationFormGroup.valid) {
    //   return;
    // }
    //
    // const output: CreateAppointmentModel = {
    //   title: this.getTitle().value,
    //   description: this.getDescription().value,
    //   link: this.getLink().value,
    //   location: this.getLocation().value,
    //   date: this.getDate().value,
    //   deadline: this.getDeadline().value,
    //   maxEnrollments: this.getMaxEnrollments().value,
    //   additions: this.parseAdditionsFromForm(),
    //   driverAddition: this.getDriverAddition().value,
    //   administrators: this.administrators,
    //   files: this.fileList,
    // };
    //
    // this.appointmentService
    //   .create(output)
    //   .subscribe(
    //     result => {
    //       if (result.type === HttpEventType.UploadProgress) {
    //         this.percentDone = Math.round(100 * result.loaded / result.total);
    //       } else if (result.type === HttpEventType.Response) {
    //         setTimeout(() => {
    //           if (result.status === HttpStatus.CREATED) {
    //             this.router.navigate([`enroll`], {
    //               queryParams: {
    //                 a: result.body.link
    //               }
    //             });
    //           }
    //         }, 2000);
    //       }
    //     },
    //     (err: HttpErrorResponse) => {
    //       if (err.status === HttpStatus.BAD_REQUEST) {
    //         if (err.error.code === 'DUPLICATE_ENTRY') {
    //           err.error.error.forEach(fColumn => {
    //               const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
    //               const fnName: string = 'get' + uppercaseName;
    //               this[fnName]().setErrors({inUse: true});
    //               const fnNameForIndex = 'getFormGroupIndexOf' + uppercaseName;
    //               this.stepper.selectedIndex = this[fnNameForIndex]();
    //             }
    //           );
    //         }
    //       }
    //     }
    //   );
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

  getOverallData(data: any) {
    this.output.title = data.title;
    this.output.date = data.date;
    this.output.deadline = data.deadline;
    this.output.location = data.location;
    this.output.maxEnrollments = data.maxEnrollments;

    this.stepper.next();
  }

  getAdditions(data: any) {
    this.output.driverAddition = data.driverAddition;
    this.output.additions = data.additions;

    this.stepper.next();
  }

  getLinkData(data: any) {
    this.output.link = data.link;
    this.output.description = data.description;

    this.stepper.next();
  }
}
