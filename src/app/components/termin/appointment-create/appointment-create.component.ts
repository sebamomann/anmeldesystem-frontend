import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatAutocomplete, MatDialog, MatStepper} from '@angular/material';
import {COMMA, SPACE, TAB} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {TemplateDialogComponent} from '../../dialogs/template-dialog/template-dialog.component';
import {isObject} from 'util';
import {AppointmentService} from '../../../services/appointment.service';
import {IFileModelUpload} from '../../../models/IFileModelUpload.model';
import {Router} from '@angular/router';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss']
})
export class AppointmentCreateComponent implements OnInit {

  @ViewChild('stepper', null) stepper: MatStepper;

  // FormGroups
  doneGroup: any;

  // Administration Form
  administrators: string[] = [];
  allUsers: string[] = ['benutzer1@sebamomann.de', 'text@example.de', 'mama@mia.com', 'foo@bar.tld', 'hallo@helmut.rofl'];
  filteredUsers: Observable<string[]>;
  readonly separatorKeysCodes: number[] = [COMMA, SPACE, TAB];
  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  // FileUpload
  private fileList: IFileModelUpload[] = [];

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
    // Not yet working
    // noinspection TypeScriptValidateJSTypes
    // this.filteredUsers = this.administrationFormGroup.get('users').valueChanges.pipe(
    //   startWith(null),
    //   map((user: string | null) => user ? this._filterAdministratorAutocomplete(user) : this.allUsers.slice()));
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
  public _openAppointmentTemplateDialog: () => void = () => {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '80vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (isObject(result)) {
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
      }
    });
  };

  private _filterAdministratorAutocomplete(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(user => user.toLowerCase().indexOf(filterValue) === 0);
  }

  // Stepper Indices
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  private getFormGroupIndexOfLink() {
    return 2;
  }

  getOverallData($event: any) {
    this.stepper.next();
  }

  getAdditions($event: any) {
    this.stepper.next();
  }

  getLinkData($event: any) {

  }
}
