import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../../services/account.service';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {HttpEventType} from '@angular/common/http';
import {ValidatorService} from '../../../../_helper/validatorService';
import {animate, query, style, transition, trigger} from '@angular/animations';

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
  styleUrls: ['./passwordreset.component.scss'],
  animations: [
    trigger('remove', [
      transition('* => void', [
        query('.layer', [
          style({opacity: '1'}),
          animate(500, style({opacity: '0'}))
        ])
      ])
    ])
  ]
})
export class PasswordresetComponent implements OnInit {
  public done = false;
  public loading: any;
  public hide = true;
  public mail: string;
  public token: string;
  public error = null;

  public mailEvent = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
  });

  public passwordResetEvent = new FormGroup({
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required]),
      passwordVerify: new FormControl('', [Validators.required]),
    }, passwordVerifyCheck()),
  });

  public doneMsg: string;
  public validated = false;
  public sendingRequestEmit = new EventEmitter<boolean>();
  private date: any;
  private mailPlain: string;

  constructor(private route: ActivatedRoute, private accountService: AccountService,
              private validatorService: ValidatorService) {
    this.route.params.subscribe(params => {
      this.mail = params.mail;
      this.mailPlain = atob(params.mail);
      this.token = params.token;
    });

    this.route.queryParams.subscribe(params => {
      this.getMail().setValue(validatorService.emailIsValid(params.mail) ? params.mail : '');
    });
  }

  async ngOnInit() {
    this.sendingRequestEmit.subscribe((value) => {
      this.loading = value;
    });

    if (this.mail != null && this.token != null) {
      await this.accountService
        .validatePasswordresetToken(this.mail, this.token)
        .subscribe(
          () => {
            this.validated = true;
          },
          err => {
            let message = '';

            if (err.status === HttpStatus.BAD_REQUEST) {
              switch (err.error.code) {
                case 'INVALID':
                  message = 'Mit diesem Link kann ich leider nichts anfangen. Hast du ihn versehentlich nicht komplett kopiert?';
                  break;
                case 'EXPIRED':
                  message = 'Sorry, der Link ist leider abgelaufen. Jeder Link ist maximal 24 Stunden gültig. ' +
                    'Erstelle dir einfach einen neuen.';
                  break;
                case 'USED':
                  const pipe = new DatePipe('de-DE');
                  this.date = pipe.transform(new Date(err.error.data.date), 'dd.MM.y, HH:mm');
                  message = `Sieht so aus, als hättest du bereits dein Passwort mit diesem Link am ` +
                    `${(this.date)} Uhr zurückgesetzt. Erstelle dir einfach einen neuen Link und komm wieder!`;
                  break;
                case 'OUTDATED':
                  message = `Du hast anscheinend bereits einen neuen Link zum zurücksetzen angefordert. ` +
                    `Diesen hier kann ich nicht mehr verarbeiten`;
                  break;
              }

              this.validated = true;
              this.error = message;
            }
          }
        );
    } else {
      this.validated = true;
    }
  }

  initReset() {
    if (this.mailEvent.valid) {
      this.sendingRequestEmit.emit(true);
      this.accountService
        .initializePasswordReset(this.getMail().value)
        .subscribe(value => {
            this.sendingRequestEmit.emit(false);

            if (value.status === 204) {
              this.done = true;
              this.doneMsg = 'Bitte folge den Anweisungen in der dir eben zugesandten Email.';
            }
          },
          err => {
            this.sendingRequestEmit.emit(false);

            this.mailEvent.get('mail').setErrors({notFound: true});
          });
    }
  }

  setPassword() {
    if (this.passwordResetEvent.valid) {
      this.sendingRequestEmit.emit(true);

      this.accountService
        .resetPassword(this.getPassword().value, this.mail, this.token)
        .subscribe(
          result => {
            if (result.type === HttpEventType.Response) {
              this.sendingRequestEmit.emit(false);
              this.done = true;
              this.doneMsg = 'Top. Ich habe dein Passwort aktualisiert!';
            }
          },
          () => {
            this.sendingRequestEmit.emit(false);

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
    } else if (this.getMail().hasError('notFound')) {
      return 'Sorry, diese Mail ist nicht in meinem System hinterlegt';
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

  public getMail() {
    return this.mailEvent.get('mail');
  }

  public getPassword() {
    return this.getPasswordGroup().get('password');
  }

  public getPasswordVerify() {
    return this.getPasswordGroup().get('passwordVerify');
  }

  public getPasswordGroup() {
    return this.passwordResetEvent.get('passwords');
  }
}
