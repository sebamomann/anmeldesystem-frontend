import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentSettingsComponent} from './appointment-settings.component';
import {RouterModule, Routes} from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';
import {ApplicationPipesModule} from '../../../pipes/application-pipes.module';
import {AdministratorDeleteModule} from '../administrator/administrator-delete/administrator-delete.module';
import {FileDeleteModule} from '../file/file-delete/file-delete.module';
import {OverallDataModule} from '../form/overall-data/overall-data.module';
import {AdditionsModule} from '../form/additions/additions.module';
import {LinkDataModule} from '../form/link-data/link-data.module';
import {AdministratorModule} from '../administrator/administrator.module';
import {FileModule} from '../file/file.module';

const routes: Routes = [
  {path: '', component: AppointmentSettingsComponent}
];

@NgModule({
  declarations: [AppointmentSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ApplicationPipesModule,
    MatAutocompleteModule,
    AdministratorDeleteModule,
    FileDeleteModule,
    OverallDataModule,
    AdditionsModule,
    LinkDataModule,
    AdministratorModule,
    FileModule,
  ]
})
export class AppointmentSettingsModule {
}
