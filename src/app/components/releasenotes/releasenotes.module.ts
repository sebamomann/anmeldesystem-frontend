import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReleasenotesComponent} from './releasenotes.component';
import {MatCardModule, MatExpansionModule, MatTabsModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: ReleasenotesComponent}
];

@NgModule({
  declarations: [
    ReleasenotesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatTabsModule,
    MatExpansionModule
  ]
})
export class ReleasenotesModule {
}
