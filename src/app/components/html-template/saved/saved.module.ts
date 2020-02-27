import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SavedComponent} from './saved.component';
import {MatIconModule} from '@angular/material';


@NgModule({
  declarations: [SavedComponent],
  exports: [
    SavedComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ]
})
export class SavedModule {
}
