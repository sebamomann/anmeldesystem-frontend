import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileDeleteComponent} from './file-delete.component';
import {MatIconModule} from '@angular/material';


@NgModule({
  declarations: [FileDeleteComponent],
  exports: [
    FileDeleteComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class FileDeleteModule {
}
