import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdministratorDeleteComponent} from './administrator-delete.component';
import {MatIconModule} from '@angular/material';


@NgModule({
  declarations: [AdministratorDeleteComponent],
  exports: [
    AdministratorDeleteComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class AdministratorDeleteModule {
}
