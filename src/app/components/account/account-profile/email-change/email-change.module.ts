import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailChangeComponent} from './email-change.component';
import {MatButtonModule, MatCardModule, MatProgressSpinnerModule} from '@angular/material';
import {HexagonLoaderModule} from '../../../html-template/hexagon-loader/hexagon-loader.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [EmailChangeComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    HexagonLoaderModule,
    RouterModule,
    MatButtonModule
  ]
})
export class EmailChangeModule {
}
