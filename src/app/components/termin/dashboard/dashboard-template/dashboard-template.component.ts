import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-template',
  templateUrl: './dashboard-template.component.html',
  styleUrls: ['./dashboard-template.component.scss']
})
export class DashboardTemplateComponent implements OnInit {

  public numberOfTemplates = new Array(3);

  constructor() {
  }

  ngOnInit() {
  }

}
