import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';
import {first} from 'rxjs/operators';
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
  public sendingRequestEmit = new EventEmitter<boolean>();
  private changeDate: Date;

  constructor(private router: Router, private route: ActivatedRoute, private validatorService: ValidatorService,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      this.getUsername().setValue(this.validatorService.emailIsValid(params.mail) ? params.mail : '');
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

      this.sendingRequestEmit.emit(true);
      this.authenticationService
        .login(username, password)
        .pipe(first())
        .subscribe(
          () => {
            this.router.navigateByUrl(retUrl)
              .then(() => {
                this.sendingRequestEmit.emit(false);

                this.snackBar.open('Erfolgreich eingeloggt',
                  'OK',
                  {
                    panelClass: 'login-snackbar',
                    duration: 2500,
                  });
              });
          },
          error => {
            this.sendingRequestEmit.emit(false);

            if (error.error.code === 'INVALID_PASSWORD') {
              this.changeDate = new Date(error.error.data);
              this.getPassword().setErrors({isOldPassword: true});
            } else if (error.error.code === 'ACCOUNT_LOCK') {
              if (error.error.data === 'NOT_ACTIVATED') {
                this.openLockedAccountDialog();
              }
            } else {
              this.getPassword().setErrors({invalid: true});
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
    this.dialog.open(AccountActivationDialogComponent, {
      id: 'account-activation-dialog',
      width: '80%',
      maxWidth: '500px',
      height: 'auto',
    });
  }
}
