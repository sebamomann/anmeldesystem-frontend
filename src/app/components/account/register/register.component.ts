import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';

export function passwordVerifyCheck(): ValidatorFn {
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

  hide = true;

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
        email: this.getEmail().value,
        password: this.getPassword().value,
        username: this.getUsername().value,
      };

      const response = this.accountService.register(userData);


      response.subscribe(res => {
          const user = res.user;
          const error = res.error;

          if (error.length === 0) {
            this.router.navigateByUrl('');
          }
        }, error => {
          error.error.error.forEach(val => {
            const fnName: string = 'get' + val.charAt(0).toUpperCase() + val.substring(1);
            this[fnName]().setErrors({inUse: true});
          });
        },
      );
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
    if (this.getEmail().hasError('required')) {
      return 'Bitte gebe eine Email-Adresse an';
    }

    if (this.getEmail().hasError('email')) {
      return 'Diese Email-Adresse hat kein gültiges Format';
    }

    if (this.getEmail().hasError('inUse')) {
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

  private getEmail() {
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
