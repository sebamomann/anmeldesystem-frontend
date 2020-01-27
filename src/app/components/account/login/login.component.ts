import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  hide = true;

  event = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  private returnUrl: string;

  constructor(private router: Router, private accountService: AccountService, private route: ActivatedRoute,
              private authenticationService: AuthenticationService, private alertService: AlertService) {
    this.route.queryParams.subscribe(params => {
      this.getUsername().setValue(params.mail);
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/dashboard';
  }

  async login(): Promise<void> {
    if (this.event.valid) {

      const username = this.getUsername().value;
      const password = this.getPassword().value;

      const retUrl = decodeURIComponent(this.returnUrl);

      await this.authenticationService.login(username, password).pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl(retUrl);
          },
          error => {
            this.alertService.error(error);
          });

    }
  }

  getUsernameErrorMessage(): string {
    return this.getUsername().hasError('required')
      ? 'Bitte gebe Email/Benutzername ein'
      : 'Etwas ist schief gelaufen';
  }

  getPasswordErrorMessage(): string {
    if (this.getPassword().hasError('required')) {
      return 'Bitte gebe dein Passwort ein';
    }
  }

  private getUsername() {
    return this.event.get('username');
  }

  private getPassword() {
    return this.event.get('password');
  }

}
