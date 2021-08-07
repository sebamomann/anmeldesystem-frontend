import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-enrollment-login-mail',
  templateUrl: './enrollment-login-mail.component.html',
  styleUrls: ['./enrollment-login-mail.component.scss']
})
export class EnrollmentLoginMailComponent implements OnInit {

  @Output('done') done__ = new EventEmitter<string>();
  @Output('cancel') cancel__ = new EventEmitter<void>();

  public currentURL: string;
  public userIsLoggedIn: boolean = this.authenticationService.userIsLoggedIn();

  public form_mail = this.formBuilder.group({
    mail: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.currentURL = this.router.routerState.snapshot.url;
  }

  public getMailErrorMessage() {
    if (this.getMail().hasError('required')) {
      return 'Bitte erforderlich';
    }
    if (this.getMail().hasError('email')) {
      return 'Bitte gebe eine gültige E-Mail Adresse an';
    }
  }

  public save() {
    console.log('SAVVEEEE');

    if (this.form_mail.valid) {
      this.done__.emit(this.getMail().value);
    }
  }

  public cancel() {
    this.cancel__.emit();
  }

  private getMail() {
    return this.form_mail.get('mail');
  }
}
