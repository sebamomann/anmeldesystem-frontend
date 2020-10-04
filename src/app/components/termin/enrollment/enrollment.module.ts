import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EnrollmentComponent} from './enrollment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'edit',
    pathMatch: 'full'
  },
  {
    path: 'edit',
    loadChildren: './enrollment-edit/enrollment-edit.module#EnrollmentEditModule',
  },
  {
    path: 'add',
    loadChildren: './enrollment-create/enrollment-create.module#EnrollmentCreateModule',
  },
];

@NgModule({
  declarations: [
    EnrollmentComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class EnrollmentModule {
}
