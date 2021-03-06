import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LinkDataComponent} from './link-data.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatTooltipModule} from '@angular/material';
import {ApplicationPipesModule} from '../../../../pipes/application-pipes.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [LinkDataComponent],
  exports: [
    LinkDataComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    ApplicationPipesModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule
  ]
})
export class LinkDataModule {
}
