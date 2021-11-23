import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) {
    this.authenticationService.openAccountSettings();
  }

  ngOnInit() {
    this.router
      .navigate(['/account'], {});
  }

}
