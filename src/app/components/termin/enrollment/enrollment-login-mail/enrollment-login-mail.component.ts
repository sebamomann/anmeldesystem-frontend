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

  @Output() done = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

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
      return 'Bitte angeben';
    }
    if (this.getMail().hasError('email')) {
      return 'Bitte eine gültige Email angeben';
    }
  }

  public _done() {
    this.done.emit(this.getMail().value);
  }

  public _cancel() {
    this.cancel.emit();
  }

  private getMail() {
    return this.form_mail.get('mail');
  }

}
