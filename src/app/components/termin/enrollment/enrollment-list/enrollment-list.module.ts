import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentListComponent} from './enrollment-list.component';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {FilterDialogComponent} from '../../../dialogs/filter/filterDialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommentDialogComponent} from '../../../dialogs/comment/commentDialog.component';
import {ConfirmationDialogComponent} from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import {ResendEnrollmentPermissionComponent} from '../../../dialogs/key-dialog/resend-enrollment-permission.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    EnrollmentListComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    ResendEnrollmentPermissionComponent,
  ],
  exports: [
    EnrollmentListComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    ResendEnrollmentPermissionComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule,
  ],
  entryComponents: [
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    ResendEnrollmentPermissionComponent,
  ]
})
export class EnrollmentListModule {
}
