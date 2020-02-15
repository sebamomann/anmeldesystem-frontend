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
import {KeyDialogComponent} from '../../../dialogs/key-dialog/key-dialog.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    EnrollmentListComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    KeyDialogComponent,
  ],
  exports: [
    EnrollmentListComponent,
    FilterDialogComponent,
    CommentDialogComponent,
    ConfirmationDialogComponent,
    KeyDialogComponent,
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
  ]
})
export class EnrollmentListModule {
}
