import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileComponent} from './file.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FileDeleteModule} from './file-delete/file-delete.module';


@NgModule({
  declarations: [FileComponent],
  exports: [
    FileComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FileDeleteModule
  ]
})
export class FileModule {
}
