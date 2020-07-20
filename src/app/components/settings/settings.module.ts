import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {MatCardModule, MatExpansionModule, MatSlideToggleModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {path: '', component: SettingsComponent},
];


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    FormsModule
  ]
})
export class SettingsModule {
}
