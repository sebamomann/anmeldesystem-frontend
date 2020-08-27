import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule} from '@angular/material';
import {AppointmentDataModule} from '../appointment-data/appointment-data.module';
import {DashboardTemplateComponent} from './dashboard-template/dashboard-template.component';
import {BookmarkModule} from '../../html-template/bookmark/bookmark.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ApplicationPipesModule} from '../../../pipes/application-pipes.module';

const routes: Routes = [
  {path: '', component: DashboardComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    AppointmentDataModule,
    BookmarkModule,
    InfiniteScrollModule,
    ApplicationPipesModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardTemplateComponent,
  ],
  exports: [],
  providers: [],
})
export class DashboardModule {
}
