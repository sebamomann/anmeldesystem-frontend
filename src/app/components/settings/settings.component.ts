import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public autoLoadOnWsCall: any;
  public autoLoadOnWsCallWifiOnly: any;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.autoLoadOnWsCall = this.settingsService.autoLoadOnWsCall;
    this.autoLoadOnWsCallWifiOnly = this.settingsService.autoLoadOnWsCallWifiOnly;
  }

  toggleAutoLoadOnWsCallWifi() {
    this.settingsService.autoLoadOnWsCallWifiOnly = this.autoLoadOnWsCallWifiOnly;
  }

  toggleAutoLoadOnWsCall(value: boolean) {
    this.autoLoadOnWsCall = value;
  }
}
