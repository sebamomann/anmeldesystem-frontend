import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpErrorResponse, HttpEventType, HttpResponse} from '@angular/common/http';
import {IUserModel} from '../../../models/IUserModel.model';
import {UserDataComponent} from '../form/user-data/user-data.component';
import {AuthenticationService} from '../../../services/authentication.service';
import {AccountService} from '../../../services/account.service';
import {BehaviorSubject} from 'rxjs';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss']
})
export class AccountProfileComponent implements OnInit {
  public userData$: BehaviorSubject<IUserModel>;
  public userData: IUserModel;
  public saveSuccess: boolean;
  @ViewChild(UserDataComponent, null)
  private userDataComponent: UserDataComponent;

  constructor(private authenticationService: AuthenticationService,
              private accountService: AccountService) {
    this.userData$ = new BehaviorSubject<IUserModel>(null);
  }

  ngOnInit() {
    this.fetchData();
  }

  public save(data: any) {
    const toChange = {};
    for (const [key, value] of Object.entries(data)) {
      if (data[key] !== this.userData[key]) {
        if (!(key === 'password' && value === '')) {
          toChange[key] = value;
        }
      }
    }

    if (JSON.stringify(toChange) !== JSON.stringify({})) {
      this.accountService
        .updateValues(toChange)
        .subscribe(
          sUserData => {
            if (sUserData.type === HttpEventType.Response) {
              if (sUserData.status <= 299) {
                this.authenticationService.setCurrentUser(sUserData.body);
                this.updateForChild(sUserData);
                this.saved();
              }
            }
          },
          error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === HttpStatus.BAD_REQUEST) {
                if (error.error.code === 'DUPLICATE_ENTRY') {
                  error.error.data.forEach(fColumn => {
                      fColumn = fColumn === 'email' ? 'mail' : fColumn;
                      this.userDataComponent.updateErrors({attr: fColumn, error: 'inUse'});
                    }
                  );
                }
              } else if (true) {
                // TODO
                // ENTITY NOT FOUND EXCEPTION
              }
            }
          }
        );
    }
  }

  public fetchData() {
    this.accountService
      .get()
      .subscribe(
        sUserData => {
          if (sUserData.type === HttpEventType.Response) {
            if (sUserData.status === HttpStatus.OK) {
              this.updateForChild(sUserData);
            }
          }
        },
        err => {
        });
  }

  private updateForChild(sUserData: HttpResponse<IUserModel>) {
    this.userData = sUserData.body;
    this.userData$.next(this.userData);
  }

  private saved() {
    this.saveSuccess = true;
    const self = this;
    setTimeout(() => {
      self.saveSuccess = false;
    }, 3000);
  }
}
