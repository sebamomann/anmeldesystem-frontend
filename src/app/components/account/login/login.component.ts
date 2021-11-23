import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loggedIn = false;

  constructor(private authenticationService: AuthenticationService,
    private router: Router, private route: ActivatedRoute
  ) {
    if (!this.authenticationService.userIsLoggedIn()) {
      this.authenticationService.login();
      return;
    }

    let returnUrl = '';
    this.route.queryParams.subscribe(params => {
      returnUrl = params.returnUrl;
    });

    returnUrl = decodeURIComponent(returnUrl);

    this.loggedIn = true;

    setTimeout(() => {
      console.log(returnUrl);
      this.router.navigateByUrl(returnUrl !== "undefined" ? returnUrl : '/dashboard');
    }, 1000)
  }

  ngOnInit() {
  }

}
