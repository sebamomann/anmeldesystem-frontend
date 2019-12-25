import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {UrlService} from '../../../services/url.service';
import {MatChipInputEvent} from '@angular/material';

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

  hasAdditions() {
    return this.additionFormGroup.controls.additions.controls.some(addition => addition.value !== null)
      || this.additionFormGroup.get('driverAddition').value;
  }


}
