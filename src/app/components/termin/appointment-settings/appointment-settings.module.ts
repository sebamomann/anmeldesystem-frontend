import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentSettingsComponent} from './appointment-settings.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule} from '@angular/material';
import {OverallDataModule} from '../form/overall-data/overall-data.module';
import {AdditionsModule} from '../form/additions/additions.module';
import {LinkDataModule} from '../form/link-data/link-data.module';
import {AdministratorModule} from '../administrator/administrator.module';
import {FileModule} from '../file/file.module';
import {SavedModule} from '../../html-template/saved/saved.module';
import {OtherModule} from '../form/other/other.module';

const routes: Routes = [
  {path: '', component: AppointmentSettingsComponent}
];

@NgModule({
  declarations: [AppointmentSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatTabsModule,
    OverallDataModule,
    AdditionsModule,
    LinkDataModule,
    AdministratorModule,
    FileModule,
    MatProgressSpinnerModule,
    MatIconModule,
    SavedModule,
    OtherModule,
    MatButtonModule,
  ]
})
export class AppointmentSettingsModule {
}
