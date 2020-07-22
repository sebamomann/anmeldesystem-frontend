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
  public autoPinAppointment: any;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.autoLoadOnWsCall = this.settingsService.autoLoadOnWsCall;
    this.autoLoadOnWsCallWifiOnly = this.settingsService.autoLoadOnWsCallWifiOnly;
    this.autoPinAppointment = this.settingsService.autoPinAppointment;
  }

  toggleAutoLoadOnWsCall(value: boolean) {
    this.autoLoadOnWsCall = value;
  }

  toggleAutoLoadOnWsCallWifi() {
    this.settingsService.autoLoadOnWsCallWifiOnly = this.autoLoadOnWsCallWifiOnly;
  }

  toggleAutoPinAppointment() {
    this.settingsService.autoPinAppointment = this.autoPinAppointment;
  }
}
