import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private router: Router, private route: ActivatedRoute) {
    if (!this.authenticationService.userIsLoggedIn()) {
      this.authenticationService.login();
      return;
    }

    let returnUrl = '';
    this.route.queryParams.subscribe(params => {
      returnUrl = params.returnUrl;
    });

    returnUrl = decodeURIComponent(returnUrl);

    this.router.navigateByUrl(returnUrl ? returnUrl : '/dashboard');
  }

  ngOnInit() {
  }

}
