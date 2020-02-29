import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {IUserModel} from '../../../../models/IUserModel.model';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../../services/account.service';

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
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})

export class UserDataComponent implements OnInit {
  @ViewChild('resendButton', {static: true})
  public resendButton: ElementRef;

  @Output()
  public save = new EventEmitter<any>();
  @Output()
  public update = new EventEmitter<null>();
  @Input()
  public register = true;
  @Input()
  public userData: IUserModel;
  @Input()
  public done = false;

  public button = 'Registrieren';

  public hide = true;

  public event: FormGroup;
  public tooltip: string;

  private mailSuccess: string;
  private mailPending = false;
  private isResend = false;
  private isCanceled = false;

  constructor(private route: ActivatedRoute, private accountService: AccountService,
              private renderer: Renderer2) {
    this.route.queryParams.subscribe(params => {
      this.mailSuccess = params.mail;
    });
  }

  ngOnInit() {
    this.event = new FormGroup({
      name: new FormControl('', [Validators.required, nameValidator()]),
      username: new FormControl('', [Validators.required, usernameValidator()]),
      mail: new FormControl('', [Validators.email, Validators.required]),
      passwords: new FormGroup({
        password: new FormControl(''),
        passwordVerify: new FormControl(''),
      }, passwordVerifyCheck()),
    });

    if (this.userData !== undefined) {
      this.parseOverallData();
    }

    if (!this.register) {
      this.event.get('username').disable();
      this.button = 'Speichern';
      this.tooltip = 'Du kannst deinen Benutzernamen (noch) nicht ändern.';
    } else {
      this.getPassword().setValidators([Validators.required]);
      this.getPasswordVerify().setValidators([Validators.required]);
      this.tooltip = 'Erlaubte Beispiele: '
        + '\r\n'
        + '\r\n max'
        + '\r\n max123 '
        + '\r\n max_m '
        + '\r\n max_123_muster '
        + '\r\n'
        + '\r\n Mindestens 3 Buchstaben. '
        + '\r\n Kein _ am Anfang oder Ende. '
        + '\r\n Nur ein _ in Folge.';
    }
  }

  resend() {
    this.accountService.resendMailChange()
      .toPromise()
      .then(res => {
        this.isResend = true;
      });
  }

  cancelMailChange() {
    this.accountService.cancelMailChange()
      .toPromise()
      .then(err => {
        this.isCanceled = true;
      });
  }

  saveFnc(): any {
    if (this.event.valid) {
      const data = {
        name: this.get('name').value,
        mail: this.get('mail').value,
        password: this.getPassword().value,
        username: this.get('username').value,
      };

      this.save.emit(data);
    } else {
      this.getPasswordVerify().setErrors({});
    }
  }

  public updateErrors(err) {
    this.get(err.attr).setErrors({[err.error]: true});
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

  private parseOverallData() {
    this.event.setValue({
      name: this.userData.name,
      username: this.userData.username,
      mail: this.userData.mail,
      passwords: {password: '', passwordVerify: ''},
    });

    if (this.userData.emailChange !== undefined) {
      this.get('mail').setValue(this.userData.emailChange[0].newMail);
      this.mailPending = true;
    }
  }
}
