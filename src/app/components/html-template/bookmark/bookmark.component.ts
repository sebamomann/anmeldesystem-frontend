import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {

  @Input() classes: ('CREATOR' | 'ADMIN' | 'ENROLLED' | 'PINNED')[];

  constructor() {
  }

  ngOnInit() {
  }

}
