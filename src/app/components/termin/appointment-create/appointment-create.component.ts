import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {UrlService} from '../../../services/url.service';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog, MatSnackBar, MatStepper} from '@angular/material';
import {COMMA, SPACE, TAB} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateAppointmentModel} from '../../../models/createAppointment.model';
import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
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
  overallDataFormGroup: any;
  additionFormGroup: any;
  linkFormGroup: any;
  administrationFormGroup: any;
  fileUpload: any;
  doneGroup: any;

  // Addition Formc
  driverAddition = false;

  // Administration Form
  administrators: string[] = [];
  allUsers: string[] = ['benutzer1@sebamomann.de', 'text@example.de', 'mama@mia.com', 'foo@bar.tld', 'hallo@helmut.rofl'];
  filteredUsers: Observable<string[]>;
  readonly separatorKeysCodes: number[] = [COMMA, SPACE, TAB];
  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  // FileUpload
  public files: Array<{ file: File, done: boolean }> = [];
  private fileList: IFileModelUpload[] = [];
  private fileBlob: Blob;

  public percentDone = 0;

  constructor(private formBuilder: FormBuilder, public urlService: UrlService,
              private http: HttpClient, private sanitizer: DomSanitizer,
              public dialog: MatDialog, private appointmentService: AppointmentService,
              private router: Router, private snackBar: MatSnackBar) {

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

    this.linkFormGroup = this.formBuilder.group({
      link: new FormControl(),
      description: new FormControl()
    });

    this.administrationFormGroup = this.formBuilder.group({
      users: new FormControl()
    });

    this.fileUpload = this.formBuilder.group({});

    this.doneGroup = this.formBuilder.group({
      saveAsTemplate: new FormControl()
    });
  }


  ngOnInit() {
    // Not yet working
    // noinspection TypeScriptValidateJSTypes
    this.filteredUsers = this.administrationFormGroup.get('users').valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filterAdministratorAutocomplete(user) : this.allUsers.slice()));
  }

  async create() {
    if (!this.overallDataFormGroup.valid ||
      !this.additionFormGroup.valid ||
      !this.linkFormGroup.valid ||
      !this.doneGroup.valid ||
      !this.administrationFormGroup.valid) {
      return;
    }

    const output: CreateAppointmentModel = {
      title: this.getTitle().value,
      description: this.getDescription().value,
      link: this.getLink().value,
      location: this.getLocation().value,
      date: this.getDate().value,
      deadline: this.getDeadline().value,
      maxEnrollments: this.getMaxEnrollments().value,
      additions: this.parseAdditionsFromForm(),
      driverAddition: this.getDriverAddition().value,
      administrators: this.administrators,
      files: this.fileList,
    };

    this.appointmentService
      .create(output)
      .subscribe(
        result => {
          if (result.type === HttpEventType.UploadProgress) {
            this.percentDone = Math.round(100 * result.loaded / result.total);
          } else if (result.type === HttpEventType.Response) {
            setTimeout(() => {
              if (result.status === HttpStatus.CREATED) {
                this.router.navigate([`enroll`], {
                  queryParams: {
                    a: result.body.link
                  }
                });
              }
            }, 2000);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === HttpStatus.BAD_REQUEST) {
            if (err.error.code === 'DUPLICATE_ENTRY') {
              err.error.error.forEach(fColumn => {
                  const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
                  const fnName: string = 'get' + uppercaseName;
                  this[fnName]().setErrors({inUse: true});
                  const fnNameForIndex = 'getFormGroupIndexOf' + uppercaseName;
                  this.stepper.selectedIndex = this[fnNameForIndex]();
                }
              );
            }
          }
        }
      );
  }

  /* FILE UPLOAD */
  selectFilesFromComputer() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({file, done: false});
      }
      this.convertFiles();
    };
    fileUpload.click();
  }

  /* Addition Form */
  formHavingAdditions() {
    return this.additionFormGroup.controls.additions.controls.some(addition => addition.value !== null)
      || this.additionFormGroup.get('driverAddition').value;
  }

  /* Administration Form */
  addAdministratorToList(event: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.administrators.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.administrationFormGroup.get('users').setValue(null);
    }
  }

  removeAdministratorFromList(user): void {
    const index = this.administrators.indexOf(user);

    if (index >= 0) {
      this.administrators.splice(index, 1);
    }
  }

  selectedAdministratorFromAutocomplete(event: MatAutocompleteSelectedEvent): void {
    this.administrators.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.administrationFormGroup.get('users').setValue(null);
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
        this.overallDataFormGroup.get('title').setValue(result.title);
        this.overallDataFormGroup.get('location').setValue(result.location);
        this.overallDataFormGroup.get('maxEnrollments').setValue(result.maxEnrollments);

        this.linkFormGroup.get('description').setValue(result.description);
        result.additions.forEach(addition => {
          this.addAdditionFormControlToFormArray(addition.name);
        });

        this.getDriverAddition().setValue(result.driverAddition);
      }
    });
  };

  async blobToBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Form Util
  addAdditionFormControlToFormArray(value: string | null = null) {
    return (this.additionFormGroup.controls.additions as FormArray).push(new FormControl(value));
  }

  removeAdditionFromFormArray(index: number) {
    this.additionFormGroup.controls.additions.removeAt(index);
  }

  // From values
  getLinkErrorMessage(): string {
    if (this.getLink().hasError('inUse')) {
      return 'Dieser Link ist leider schon in Benutzung';
    }
  }

  private parseAdditionsFromForm() {
    const additions = [];
    this.additionFormGroup.controls.additions.controls.forEach(field => field.value != null ? additions.push({name: field.value}) : '');
    return additions;
  };

  private _filterAdministratorAutocomplete(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(user => user.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * Convert uploaded Files to BLOB->Bade64 String and add to array as objects for API call
   */
  private convertFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.convertFile(file).catch(() => {
        this.snackBar.open('Datei konnte nicht hochgeladen werden', null, {
          duration: 2000,
          panelClass: 'snackbar-error'
        });
      });
    });
  }

  private async convertFile(file) {
    this.fileBlob = new Blob([file.file], {type: 'application/octet-stream'});
    const result = await this.blobToBase64(this.fileBlob).catch(e => e);
    if (result instanceof Error) {
      return;
    }
    this.fileList.push({name: file.file.name, data: result.toString()});
  }

  private getMaxEnrollments() {
    return this.overallDataFormGroup.get('maxEnrollments');
  }

  private getDeadline() {
    return this.overallDataFormGroup.get('deadline');
  }

  private getDate() {
    return this.overallDataFormGroup.get('date');
  }

  private getLocation() {
    return this.overallDataFormGroup.get('location');
  }

  private getTitle() {
    return this.overallDataFormGroup.get('title');
  }

  private getLink() {
    return this.linkFormGroup.get('link');
  }

  private getDescription() {
    return this.linkFormGroup.get('description');
  }

  private getDriverAddition() {
    return this.additionFormGroup.get('driverAddition');
  }

  // Stepper Indices
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  private getFormGroupIndexOfLink() {
    return 2;
  }
}
