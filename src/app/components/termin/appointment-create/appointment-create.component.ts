import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {UrlService} from '../../../services/url.service';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog} from '@angular/material';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateAppointmentModel} from '../../../models/createAppointment.model';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {IFileModel} from '../../../models/IFileModel.model';
import {TemplateDialogComponent} from '../../dialogs/template-dialog/template-dialog.component';
import {isObject} from 'util';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss']
})
export class AppointmentCreateComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, public urlService: UrlService, private http: HttpClient, private sanitizer: DomSanitizer,
              public dialog: MatDialog) {

    this.overallDataFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      deadline: [''],
      location: [''],
      maxEnrollments: [''],
    });

    this.additionFormGroup = this.formBuilder.group({
      additions: new FormArray([new FormControl()]),
      driverAddition: new FormControl()
    });

    this.linkFormGroup = this.formBuilder.group({
      link: new FormControl(),
      description: new FormControl()
    });

    this.administrationFormGroup = this.formBuilder.group({
      users: new FormControl()
    });

    this.doneGroup = this.formBuilder.group({
      saveAsTemplate: new FormControl()
    });

    // Not yet working
    // noinspection TypeScriptValidateJSTypes
    this.filteredUsers = this.administrationFormGroup.get('users').valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.allUsers.slice()));
  }

  public downloadUrl: any = '';

  overallDataFormGroup: any;
  additionFormGroup: any;
  linkFormGroup: any;
  fileUpload: any;
  doneGroup: any;

  administrationFormGroup: any;
  /* Addition Form */
  driverAddition = false;

  /* Administration Form */
  users = [];

  filteredUsers: Observable<string[]>;
  /* FILE UPLOAD */
  public files: Array<{ file: File, done: boolean }> = [];

  private fileData: IFileModel[] = [];

  allUsers: string[] = ['benutzer1@sebamomann.de', 'text@example.de', 'mama@mia.com', 'foo@bar.tld', 'hallo@helmut.rofl'];
  readonly separatorKeysCodes: number[] = [COMMA, SPACE];
  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  private fileBlob: Blob;
  private string;
  private type;

  ngOnInit() {
  }

  addAddition(value: string | null = null) {
    return (this.additionFormGroup.controls.additions as FormArray).push(new FormControl(value));
  }

  create() {
    const additions = [];
    this.additionFormGroup.controls.additions.controls.forEach(field => additions.push(field.value));

    let output: CreateAppointmentModel;
    output = {
      title: this.overallDataFormGroup.get('title').value,
      description: this.linkFormGroup.get('description').value,
      link: this.linkFormGroup.get('link').value,
      location: this.overallDataFormGroup.get('title').value,
      date: this.overallDataFormGroup.get('date').value,
      deadline: this.overallDataFormGroup.get('deadline').value,
      maxEnrollments: this.overallDataFormGroup.get('maxEnrollments').value,
      additions,
      driverAddition: this.driverAddition,
      administrations: this.users,
      files: this.fileData,
    };

    console.log(JSON.stringify(output));

    return output;
  }

  /* Addition Form */
  removeAddition(index: number) {
    this.additionFormGroup.controls.additions.removeAt(index);
  }

  hasAdditions() {
    return this.additionFormGroup.controls.additions.controls.some(addition => addition.value !== null)
      || this.additionFormGroup.get('driverAddition').value;
  }

  /* Administration Form */
  add(event: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.users.push({mail: value.trim()});
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.administrationFormGroup.get('users').setValue(null);
    }
  }

  removeUser(user): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.administrationFormGroup.get('users').setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(user => user.toLowerCase().indexOf(filterValue) === 0);
  }

  /* FILE UPLOAD */
  selectFile() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({file, done: false});
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  private async uploadFile(file) {
    this.fileBlob = new Blob([file.file], {type: 'application/octet-stream'});
    const result = await this.toBase64(this.fileBlob).catch(e => e);
    if (result instanceof Error) {
      return;
    }
    this.fileData.push({name: file.file.name, data: result.toString()});
    setTimeout(() => {
        file.done = true;
      },
      1000);

  }

  async toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  /* Template selection*/
  openAppointmentTemplateDialog() {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '90%',
      maxWidth: 'initial',
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
          this.addAddition(addition.name);
        });

        this.driverAddition = result.driverAddition;
      }
    });
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
