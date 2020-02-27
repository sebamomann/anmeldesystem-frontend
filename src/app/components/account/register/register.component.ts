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

function usernameValidator(): ValidatorFn {
  return (control: FormGroup): ValidationErrors => {
    const val = control.value;

    // throw error if not in format and not at least 3 non-digit characters
    return (!val.match(/^([a-z0-9])+([_]?[a-z0-9]+)*$/g)
      || (val.replace(new RegExp('[0-9_]', 'g'), '').length < 3))
      ? {invalidUsername: true}
      : null;
  };
}

function nameValidator(): ValidatorFn {
  return (control: FormGroup): ValidationErrors => {
    const val = control.value;

    // throw error if not in format and not at least 3 non-digit characters
    return (!val.match(/^([A-Za-z0-9äüöß])+([ ]?[A-Za-z0-9äüöß]+)*$/g)
      || (val.replace(new RegExp('[0-9 ]', 'g'), '').length < 3))
      ? {invalidUsername: true}
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
  public verified = false;

  event = new FormGroup({
    name: new FormControl('', [Validators.required, nameValidator()]),
    username: new FormControl('', [Validators.required, usernameValidator()]),
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
        name: this.get('name').value,
        mail: this.get('email').value,
        password: this.getPassword().value,
        username: this.get('username').value,
      };

      this.accountService.register(userData).subscribe(res => {
          this.done = true;
        },
        (err: HttpErrorResponse) => {
          if (err.status === HttpStatus.BAD_REQUEST) {
            if (err.error.code === 'DUPLICATE_ENTRY') {
              err.error.error.forEach(fColumn => {
                this.get(fColumn).setErrors({inUse: true});
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

  getErrorMessage(str: string) {
    if (str !== '') {
      if (this.get(str).hasError('required')) {
        return 'Erforderlich';
      } else if (this.get(str).hasError('inUse')) {
        return 'Bereits in Benutzung';
      } else if (this.get(str).hasError('email')) {
        return 'Diese Email-Adresse hat kein gültiges Format';
      } else if (this.get(str).hasError('invalidUsername')) {
        return 'Invalides Format (i)';
      }
    } else {
      if (this.getPasswordGroup().hasError('mismatch')) {
        return 'Die Passwörter stimmen nicht überein';
      } else if (this.getPasswordGroup().get('password').hasError('required')) {
        return 'Erforderlich';
      }
    }
  }

  private get(str: string) {
    return this.event.get(str);
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
