import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserDataComponent} from '../../user/form/user-data/user-data.component';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild(UserDataComponent, null)
  userDataComponent: UserDataComponent;

  public done;

  // verify
  public mail: string;
  public token: string;
  public error = null;
  public verified = false;

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

  createAccount(data: any) {
    this.accountService
      .register(data)
      .subscribe(
        res => {
          this.done = true;
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === HttpStatus.BAD_REQUEST) {
              if (err.error.code === 'ER_DUP_ENTRY') {
                err.error.error.columns.forEach(fColumn => {
                    this.userDataComponent.updateErrors({attr: fColumn, error: 'inUse'});
                  }
                );
              }
            }
          }
        }
      );
  }
}
