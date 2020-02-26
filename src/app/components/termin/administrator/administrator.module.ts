import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdministratorComponent} from './administrator.component';
import {AdministratorDeleteModule} from './administrator-delete/administrator-delete.module';
import {MatButtonModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [AdministratorComponent],
  exports: [
    AdministratorComponent
  ],
  imports: [
    CommonModule,
    AdministratorDeleteModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class AdministratorModule {
}
