import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../../../services/alert.service';
import {DatePipe} from '@angular/common';

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
  private changeDate: Date;

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
            console.log(error.error.error);
            this.changeDate = new Date(error.error.error);
            this.getPassword().setErrors({isOldPassword: true});
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

    if (this.getPassword().hasError('isOldPassword')) {
      const pipe = new DatePipe('de-DE');
      return 'Du hast dieses Passwort am ' + pipe.transform(this.changeDate, 'dd.MM.y, HH:mm') + 'Uhr geändert';
    }
  }

  public getUsername() {
    return this.event.get('username');
  }

  public getPassword() {
    return this.event.get('password');
  }

}
