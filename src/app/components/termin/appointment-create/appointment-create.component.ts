import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {UrlService} from '../../../services/url.service';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss']
})
export class AppointmentCreateComponent implements OnInit {
  overallDataFormGroup: any;
  additionFormGroup: any;
  linkFormGroup: any;
  administrationFormGroup: any;

  /* Addition Form */
  driverAddition = false;
  additions = [];

  /* Administration Form */
  users = [];
  filteredUsers: Observable<string[]>;
  allUsers: string[] = ['benutzer1@sebamomann.de', 'text@example.de', 'mama@mia.com', 'foo@bar.tld', 'hallo@helmut.rofl'];

  readonly separatorKeysCodes: number[] = [COMMA, SPACE];

  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  constructor(private formBuilder: FormBuilder, private urlService: UrlService) {

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

    // Not yet working
    // noinspection TypeScriptValidateJSTypes
    this.filteredUsers = this.administrationFormGroup.get('users').valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.allUsers.slice()));
  }

  ngOnInit() {
  }

  addAddition() {
    (this.additionFormGroup.controls.additions as FormArray).push(new FormControl());
  }

  create() {
    const additions = [];
    this.additionFormGroup.controls.additions.controls.forEach(field => additions.push(field.value));

    const output: CreateAppointmentModel = {
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
}
