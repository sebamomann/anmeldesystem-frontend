import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';

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

  constructor(private router: Router, private accountService: AccountService) {
  }

  ngOnInit() {
  }

  login(): void {
    if (this.event.valid) {

      const userCredentials = {
        username: this.getUsername().value,
        password: this.getPassword().value,
      };

      const response = this.accountService.login(userCredentials);

      response.subscribe(res => {
        this.router.navigateByUrl('');
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
