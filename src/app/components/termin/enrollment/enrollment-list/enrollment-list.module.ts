import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentListComponent} from './enrollment-list.component';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
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
import {EnrollmentMissingPermissionDialogComponent} from '../../../dialogs/enrollment-missing-permission-dialog/enrollment-missing-permission.dialog.component';
import {RouterModule} from '@angular/router';
import {LoadingDisableModule} from '../../../../directives/loading-disable/loading-disable.module';
import {EnrollmentDetailsModule} from '../enrollment-details/enrollment-details.module';


@NgModule({
  declarations: [
    EnrollmentListComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    EnrollmentMissingPermissionDialogComponent,
  ],
  exports: [
    EnrollmentListComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    EnrollmentMissingPermissionDialogComponent,
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
    LoadingDisableModule,
    MatCardModule,
    EnrollmentDetailsModule,
  ],
  entryComponents: [
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    EnrollmentMissingPermissionDialogComponent,
  ]
})
export class EnrollmentListModule {
}
