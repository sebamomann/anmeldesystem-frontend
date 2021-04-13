import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.openAccountSettings();
  }

  ngOnInit() {
  }

}
