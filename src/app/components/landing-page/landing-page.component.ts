import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public userIsLoggedIn: boolean = this.authenticationService.currentUserValue !== null;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

}
