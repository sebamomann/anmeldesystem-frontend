import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-go-back-header',
  templateUrl: './go-back-header.component.html',
  styleUrls: ['./go-back-header.component.scss']
})
export class GoBackHeaderComponent implements OnInit {

  @Input()
  private appointment;

  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
