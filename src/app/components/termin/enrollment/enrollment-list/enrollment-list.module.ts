import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnrollmentListComponent} from './enrollment-list.component';
import {MatBadgeModule, MatExpansionModule, MatIconModule} from '@angular/material';


@NgModule({
  declarations: [
    EnrollmentListComponent
  ],
  exports: [
    EnrollmentListComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatExpansionModule
  ]
})
export class EnrollmentListModule {
}
