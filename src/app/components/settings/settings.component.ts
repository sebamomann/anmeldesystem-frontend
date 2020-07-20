import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public autoLoadOnWsCall: any;
  public autoLoadOnWsCallWifi: any;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.autoLoadOnWsCall = this.settingsService.autoLoadOnWsCall;
    this.autoLoadOnWsCallWifi = this.settingsService.autoLoadOnWsCallWifi;
  }

  toggleAutoLoadOnWsCall() {
    this.settingsService.autoLoadOnWsCall = this.autoLoadOnWsCall;
  }

  toggleAutoLoadOnWsCallWifi() {
    this.settingsService.autoLoadOnWsCallWifi = this.autoLoadOnWsCallWifi;
  }
}
