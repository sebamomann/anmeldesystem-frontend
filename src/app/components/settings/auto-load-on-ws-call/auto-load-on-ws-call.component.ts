import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SettingsService} from '../../../services/settings.service';

@Component({
  selector: 'app-auto-load-on-ws-call',
  templateUrl: './auto-load-on-ws-call.component.html',
  styleUrls: ['./auto-load-on-ws-call.component.scss']
})
export class AutoLoadOnWsCallComponent implements OnInit {

  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  public value: boolean;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.value = this.settingsService.autoLoadOnWsCall;
  }

  toggleAutoLoadOnWsCall() {
    this.settingsService.autoLoadOnWsCall = this.value;
    this.toggle.emit(this.value);
  }
}
