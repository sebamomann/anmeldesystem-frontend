import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HexagonLoaderComponent} from './hexagon-loader.component';


@NgModule({
  declarations: [HexagonLoaderComponent],
  exports: [
    HexagonLoaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HexagonLoaderModule {
}
