import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';

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

  driverAddition: any;
  additions = [];

  constructor(private formBuilder: FormBuilder) {

    this.firstFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      expire: [],
      location: [''],
    });

    this.additionFormGroup = this.formBuilder.group({
      additions: new FormArray([new FormControl()]),
      driverAddition: new FormControl()
    });

    this.secondFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });

    this.thirdFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  addAddition() {
    (this.additionFormGroup.controls.additions as FormArray).push(new FormControl());
  }

  create() {

  }

  remove(index: number) {
    this.additionFormGroup.controls.additions.removeAt(index);
  }
}
