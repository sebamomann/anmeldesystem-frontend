import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountActivationDialogComponent} from './account-activation-dialog.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';


@NgModule({
  declarations: [AccountActivationDialogComponent],
  exports: [AccountActivationDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [
    AccountActivationDialogComponent
  ]
})
export class AccountActivationDialogModule {
}
