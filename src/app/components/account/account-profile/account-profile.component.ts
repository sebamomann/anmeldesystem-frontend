import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {IUserModel} from '../../../models/IUserModel.model';
import {UserDataComponent} from '../../user/form/user-data/user-data.component';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserService} from '../../../services/user.service';

const HttpStatus = require('http-status-codes');

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss']
})
export class AccountProfileComponent implements OnInit {
  @ViewChild(UserDataComponent, null)
  userDataComponent: UserDataComponent;

  public userData: IUserModel;
  public saveSuccess: boolean;

  constructor(private authenticationService: AuthenticationService, private userService: UserService) {
  }

  ngOnInit() {
    this.userData = this.authenticationService.currentUserValue;
  }

  save(data: any) {
    const toChange = {};
    for (const [key, value] of Object.entries(data)) {
      if (data[key] !== this.userData[key]) {
        if (key === 'password' && value === '') {
          continue;
        }

        toChange[key] = value;
      }
    }

    if (toChange !== {}) {
      this.userService
        .updateValues(toChange, this.userData)
        .subscribe(
          res => {
            if (res.type === HttpEventType.Response) {
              if (res.status <= 299) {
                this.authenticationService.setCurrentUser(res.body);
                this.saved();
              }
            }
          },
          error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === HttpStatus.BAD_REQUEST) {
                if (error.error.code === 'ER_DUP_ENTRY') {
                  error.error.error.columns.forEach(fColumn => {
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

  private saved() {
    this.saveSuccess = true;
    const self = this;
    setTimeout(() => {
      self.saveSuccess = false;
    }, 3000);
  }
}
