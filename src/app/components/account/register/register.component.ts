import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
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

  event = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required]),
      passwordVerify: new FormControl('', [Validators.required]),
    }, passwordVerifyCheck()),
  });

  constructor(private router: Router, private accountService: AccountService) {
  }

  ngOnInit() {
  }

  create(): void {
    if (this.event.valid) {

      const userData = {
        mail: this.getMail().value,
        password: this.getPassword().value,
        username: this.getUsername().value,
      };

      this.accountService.register(userData).subscribe(res => {

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
