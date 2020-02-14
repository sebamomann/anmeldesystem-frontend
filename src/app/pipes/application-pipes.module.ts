import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UrlEncodePipe} from './url-encode.pipe';


@NgModule({
  declarations: [
    UrlEncodePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UrlEncodePipe
  ]
})
export class ApplicationPipesModule {
}
