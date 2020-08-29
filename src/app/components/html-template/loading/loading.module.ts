import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingComponent} from './loading.component';
import {MatProgressSpinnerModule} from '@angular/material';
import {HexagonLoaderModule} from '../hexagon-loader/hexagon-loader.module';


@NgModule({
  declarations: [LoadingComponent],
  exports: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    HexagonLoaderModule
  ]
})
export class LoadingModule {
}
