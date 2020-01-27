import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

const HttpStatus = require('http-status-codes');

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
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordresetComponent implements OnInit {
  public done = false;
  public loading: any;
  private hide = true;
  private mail: string;
  private token: string;
  private error = null;
  private mailEvent = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
  });
  private passwordResetEvent = new FormGroup({
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required]),
      passwordVerify: new FormControl('', [Validators.required]),
    }, passwordVerifyCheck()),
  });
  private doneMsg: string;
  private date: any;

  constructor(private route: ActivatedRoute, private accountService: AccountService) {
    this.route.params.subscribe(params => {
      this.mail = params.mail;
      this.token = params.token;
    });

    this.route.queryParams.subscribe(params => {
      this.getMail().setValue(params.mail);
    });
  }

  async ngOnInit() {
    if (this.mail != null && this.token != null) {
      await this.accountService
        .validatePasswordresetToken(this.mail, this.token)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            let message = '';
            if (error.status === HttpStatus.BAD_REQUEST) {
              switch (error.error.code) {
                case 'INVALID':
                  message = 'Mit diesem Link kann ich leider nichts anfangen. Hast du ihn versehentlich nicht komplett kopiert?';
                  break;
                case 'EXPIRED':
                  message = 'Sorry, der Link ist leider abgelaufen. Jeder Link ist maximal 24 Stunden gültig. ' +
                    'Erstelle dir einfach einen neuen.';
                  break;
                case 'USED':
                  const pipe = new DatePipe('de-DE');
                  this.date = pipe.transform(new Date(error.error.error.date), 'dd.MM.y, HH:mm');
                  message = `Sieht so aus, als hättest du bereits dein Passwort mit diesem Link am ` +
                    `${(this.date)} Uhr zurückgesetzt. Erstelle dir einfach einen neuen Link und komm wieder!`;
                  break;
                case 'OUTDATED':
                  message = `Du hast anscheinend bereits einen neuen Link zum zurücksetzen angefordert. ` +
                    `Diesen hier kann ich nicht mehr verarbeiten`;
                  break;
              }

              this.error = message;
            }
          }
        );
    }
  }

  initReset() {
    if (this.mailEvent.valid) {
      this.loading = true;
      this.accountService.initReset(this.getMail().value).subscribe(value => {
        if (value.status === 204) {
          setTimeout(() => {
            this.loading = false;
            this.done = true;
            this.doneMsg = 'Bitte folge den Anweisungen in der dir eben zugesandten Email.';
          }, 1000);
        }
      });
    }
  }

  setPassword() {
    if (this.passwordResetEvent.valid) {
      this.accountService
        .resetPassword(this.getPassword().value, this.mail, this.token)
        .subscribe(
          result => {
            if (result.status === 204) {
              setTimeout(() => {
                this.done = true;
                this.doneMsg = 'Top. Ich habe dein passwort geändert!';
              }, 1000);
            }
          },
          err => {
            console.log('se' + err);
            console.log(err);
            this.error = 'Huch, da ist etwas schief gegangen. Ich kann dir leider nicht weiterhelfen. Versuche es später nochmal.';
          });
    } else {
      this.getPasswordVerify().setErrors({mismatch: true});
    }
  }

  public getMailErrorMessage() {
    if (this.getMail().hasError('required')) {
      return 'Bitte gebe eine Mail Adresse an';
    } else if (this.getMail().hasError('email')) {
      return 'Bitte gebe eine gültige E-Mail Adresse an';
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
    } else if (this.getPasswordVerify().hasError('mismatch')) {
      return 'Die Passwörter stimmen nicht überein';
    }
  }

  private getMail() {
    return this.mailEvent.get('mail');
  }

  private getPassword() {
    return this.getPasswordGroup().get('password');
  }

  private getPasswordVerify() {
    return this.getPasswordGroup().get('passwordVerify');
  }

  private getPasswordGroup() {
    return this.passwordResetEvent.get('passwords');
  }
}
