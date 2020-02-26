import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AppointmentCreateComponent} from './appointment-create.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatStepperModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../../_helper/auth.guard';
import {OverallDataModule} from '../form/overall-data/overall-data.module';
import {AdditionsModule} from '../form/additions/additions.module';
import {LinkDataModule} from '../form/link-data/link-data.module';
import {TemplateDialogComponent} from '../../dialogs/template-dialog/template-dialog.component';

const routes: Routes = [
  {path: '', component: AppointmentCreateComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppointmentCreateComponent,
    TemplateDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatStepperModule,
    OverallDataModule,
    AdditionsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule,
    LinkDataModule,
    MatListModule,
    MatDialogModule,
  ],
  exports: [],
  providers: [TemplateDialogComponent],
  entryComponents: [TemplateDialogComponent]
})
export class AppointmentCreateModule {
}
