import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {HttpErrorResponse} from '@angular/common/http';

const HttpStatus = require('http-status-codes');

function passwordVerifyCheck(): ValidatorFn {
  return (control: FormGroup): ValidationErrors => {
    const pass = control.controls.password.value;
    const passVerify = control.controls.passwordVerify.value;

    return (passVerify !== pass)
      ? {mismatch: true}
      : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public hide = true;
  public done = false;

  // verify
  public mail: string;
  public token: string;
  public error = null;
  private verified = false;

  event = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required]),
      passwordVerify: new FormControl('', [Validators.required]),
    }, passwordVerifyCheck()),
  });

  constructor(private router: Router, private accountService: AccountService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.mail = params.mail;
      this.token = params.token;
    });
  }

  async ngOnInit() {
    if (this.mail != null && this.token != null) {
      await this.accountService
        .activateUserByEmail(this.mail, this.token)
        .subscribe(
          result => {
            this.verified = true;
          },
          error => {
            let message = '';
            if (error.status === HttpStatus.BAD_REQUEST) {
              switch (error.error.code) {
                case 'INVALID':
                  message = 'Mit diesem Link kann Ich leider nichts anfangen. Hast du ihn versehentlich nicht komplett kopiert?';
                  break;
                case 'USED':
                  message = `Dein Account ist bereits freigeschalten. Du kannst dich einloggen!`;
                  break;
              }

              this.error = message;
            }
          }
        );
    }
  }

  create(): void {
    if (this.event.valid) {

      const userData = {
        mail: this.getMail().value,
        password: this.getPassword().value,
        username: this.getUsername().value,
      };

      this.accountService.register(userData).subscribe(res => {
          this.done = true;
        },
        (err: HttpErrorResponse) => {
          if (err.status === HttpStatus.BAD_REQUEST) {
            if (err.error.code === 'DUPLICATE_ENTRY') {
              err.error.error.forEach(fColumn => {
                  const uppercaseName = fColumn.charAt(0).toUpperCase() + fColumn.substring(1);
                  const fnName: string = 'get' + uppercaseName;
                  this[fnName]().setErrors({inUse: true});
                }
              );
            }
          }
        }
      );
    } else {
      this.getPasswordVerify().setErrors({});
    }
  }

  getUsernameErrorMessage(): string {
    if (this.getUsername().hasError('required')) {
      return 'Bitte gebe einen Benutezrnamen an';
    }

    if (this.getUsername().hasError('inUse')) {
      return 'Dieser Benutzername ist bereits vergeben';
    }
  }

  getEmailErrorMessage(): string {
    if (this.getMail().hasError('required')) {
      return 'Bitte gebe eine Email-Adresse an';
    }

    if (this.getMail().hasError('email')) {
      return 'Diese Email-Adresse hat kein gültiges Format';
    }

    if (this.getMail().hasError('inUse')) {
      return 'Diese Email wird bereits verwendet';
    }
  }

  getPasswordErrorMessage(): string {
    if (this.getPassword().hasError('required')) {
      return 'Bitte gebe ein Passwort an';
    }
  }

  getPasswordVerifyErrorMessage(): string {
    if (this.getPasswordVerify().hasError('required')) {
      return 'Bitte wiederhole dein Passwort';
    }

    if (this.getPasswordGroup().hasError('mismatch')) {
      return 'Die Passwörter stimmen nicht überein';
    }
  }

  private getUsername() {
    return this.event.get('username');
  }

  private getMail() {
    return this.event.get('email');
  }

  private getPasswordGroup() {
    return this.event.get('passwords');
  }

  private getPassword() {
    return this.event.get('passwords').get('password');
  }

  private getPasswordVerify() {
    return this.event.get('passwords').get('passwordVerify');
  }
}
