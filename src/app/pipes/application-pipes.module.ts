import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UrlEncodePipe} from './url-encode.pipe';
import {MonthnamePipe} from './monthname.pipe';


@NgModule({
  declarations: [
    UrlEncodePipe,
    MonthnamePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UrlEncodePipe,
    MonthnamePipe
  ]
})
export class ApplicationPipesModule {
}
