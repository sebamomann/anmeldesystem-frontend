import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileComponent} from './file.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule} from '@angular/material';
import {FileDeleteModule} from './file-delete/file-delete.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [FileComponent],
  exports: [
    FileComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FileDeleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    RouterModule
  ]
})
export class FileModule {
}
