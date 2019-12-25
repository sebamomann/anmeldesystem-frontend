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
  firstFormGroup: any;
  secondFormGroup: any;
  thirdFormGroup: any;
  additionFormGroup: any;

  /* Addition Form */
  driverAddition: any;
  additions = [];

  /* Administration Form */
  users = [];
  filteredUsers: Observable<string[]>;
  allUsers: string[] = ['benutzer1@sebamomann.de', 'text@example.de', 'mama@mia.com', 'foo@bar.tld', 'hallo@helmut.rofl'];

  readonly separatorKeysCodes: number[] = [COMMA, SPACE];

  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  constructor(private formBuilder: FormBuilder, private urlService: UrlService) {

    this.firstFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      expire: [],
      location: [''],
      limit: [''],
    });

    this.additionFormGroup = this.formBuilder.group({
      additions: new FormArray([new FormControl()]),
      driverAddition: new FormControl()
    });

    this.secondFormGroup = this.formBuilder.group({
      link: new FormControl()
    });

    this.thirdFormGroup = this.formBuilder.group({
      users: new FormControl()
    });

    this.filteredUsers = this.thirdFormGroup.get('users').valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.allUsers.slice()));
  }

  ngOnInit() {
  }

  addAddition() {
    (this.additionFormGroup.controls.additions as FormArray).push(new FormControl());
  }

  create() {

  }

  removeAddition(index: number) {
    this.additionFormGroup.controls.additions.removeAt(index);
  }

  hasAdditions() {
    return this.additionFormGroup.controls.additions.controls.some(addition => addition.value !== null)
      || this.additionFormGroup.get('driverAddition').value;
  }

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

      this.thirdFormGroup.get('users').setValue(null);
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
    this.thirdFormGroup.get('users').setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(user => user.toLowerCase().indexOf(filterValue) === 0);
  }
}
