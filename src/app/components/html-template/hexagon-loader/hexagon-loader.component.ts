import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hexagon-loader',
  templateUrl: './hexagon-loader.component.html',
  styleUrls: ['./hexagon-loader.component.scss']
})
export class HexagonLoaderComponent implements OnInit {

  @Input() message: string;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }

}
