import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoLoadOnWsCallComponent} from './auto-load-on-ws-call.component';
import {MatSlideToggleModule} from '@angular/material';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [AutoLoadOnWsCallComponent],
  exports: [AutoLoadOnWsCallComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule
  ]
})
export class AutoLoadOnWsCallModule {
}
