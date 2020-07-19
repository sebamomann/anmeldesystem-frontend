import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupportComponent} from './support.component';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule, MatExpansionModule} from '@angular/material';

const routes: Routes = [
  {path: '', component: SupportComponent},
];

@NgModule({
  declarations: [SupportComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    MatExpansionModule
  ]
})
export class SupportModule {
}
