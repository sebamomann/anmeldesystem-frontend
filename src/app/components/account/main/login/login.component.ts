import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../services/account.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../../../../services/alert.service';
import {DatePipe} from '@angular/common';
import {ValidatorService} from '../../../../_helper/validatorService';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AccountActivationDialogComponent} from '../../../dialogs/account-activation/account-activation-dialog.component';

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

  public returnUrl = '';
  private changeDate: Date;
  public message = '';

  constructor(private router: Router, private accountService: AccountService, private route: ActivatedRoute,
              private authenticationService: AuthenticationService, private alertService: AlertService,
              private validatorService: ValidatorService, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      this.getUsername().setValue(validatorService.emailIsValid(params.mail) ? params.mail : '');
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
          () => {
            this.router.navigateByUrl(retUrl)
              .then(() => {
                this.snackBar.open('Erfolgreich eingeloggt',
                  'OK',
                  {
                    duration: 2000,
                  });
              });
          },
          error => {
            if (error.error.code === 'INVALID_PASSWORD') {
              this.changeDate = new Date(error.error.data);
              this.getPassword().setErrors({isOldPassword: true});
            } else if (error.error.code === 'ACCOUNT_LOCK') {
              if (error.error.data === 'NOT_ACTIVATED') {
                this.openLockedAccountDialog();
              }
            }
          });
    }
  }

  getUsernameErrorMessage(): string {
    if (this.getUsername().hasError('required')) {
      return 'Bitte gebe deine E-Mail ein';
    }
  }

  getPasswordErrorMessage(): string {
    if (this.getPassword().hasError('required')) {
      return 'Bitte gebe dein Passwort ein';
    }

    if (this.getPassword().hasError('isOldPassword')) {
      const pipe = new DatePipe('de-DE');
      return 'Du hast dieses Passwort am ' + pipe.transform(this.changeDate, 'dd.MM.y, HH:mm') + 'Uhr geändert';
    }

    if (this.getPassword().hasError('invalid')) {
      return 'Benutzername oder Passwort falsch';
    }
  }

  public getUsername() {
    return this.event.get('username');
  }

  public getPassword() {
    return this.event.get('password');
  }

  private openLockedAccountDialog() {
    const dialogRef = this.dialog.open(AccountActivationDialogComponent, {
      width: '80%',
      maxWidth: '500px',
      height: 'auto',
    });
  }
}
