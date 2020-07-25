import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookmarkComponent} from './bookmark.component';


@NgModule({
  declarations: [BookmarkComponent],
  exports: [
    BookmarkComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BookmarkModule {
}
