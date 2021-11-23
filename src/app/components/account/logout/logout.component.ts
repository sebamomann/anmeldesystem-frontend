import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  public loggedIn = true;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.logout();
  }

  ngOnInit() {
  }

}
