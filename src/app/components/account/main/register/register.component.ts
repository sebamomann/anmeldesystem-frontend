import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../services/account.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserDataComponent} from '../../form/user-data/user-data.component';

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
      this.mail = window.atob(params.mail);
      this.token = params.token;
    });
  }

  async ngOnInit() {
    if (this.mail != null && this.token != null) {
      await this.accountService
        .activate(this.mail, this.token)
        .subscribe(
          () => {
            this.verified = true;
          },
          err => {
            let message = '';

            if (err.status === HttpStatus.BAD_REQUEST) {
              switch (err.error.code) {
                case 'INVALID':
                  message = 'Mit diesem Link kann Ich leider nichts anfangen. Hast du ihn versehentlich nicht komplett kopiert?';
                  break;
                case 'USED':
                  message = `Dein Account ist bereits freigeschalten. Du kannst dich einloggen!`;
                  break;
              }

              this.error = message;
            } else if (true) {
              // TODO
              // ENTITY GONE EXCEPTION
            }
          }
        );
    }
  }

  public createAccount(data: any) {
    this.accountService
      .register(data)
      .subscribe(
        () => {
          this.done = true;
          this.userDataComponent.requestSent();
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === HttpStatus.BAD_REQUEST) {
              if (err.error.code === 'DUPLICATE_ENTRY') {
                err.error.data.forEach(fColumn => {
                    fColumn = fColumn === 'email' ? 'mail' : fColumn;

                    this.userDataComponent
                      .updateErrors({
                        attr: fColumn,
                        error: 'inUse'
                      });
                  }
                );
              }
            }
          }

          this.userDataComponent.requestSent();
        }
      );
  }
}
