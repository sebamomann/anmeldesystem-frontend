import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
  }

  public get autoLoadOnWsCall() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      return false;
    }

    return settings.autoLoadOnWsCall;
  }

  public set autoLoadOnWsCall(value: boolean) {
    let settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      settings = {};
    }

    settings.autoLoadOnWsCall = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  public get autoLoadOnWsCallWifi() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      return false;
    }

    return settings.autoLoadOnWsCallWifi;
  }

  public set autoLoadOnWsCallWifi(value: boolean) {
    let settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      settings = {};
    }

    settings.autoLoadOnWsCallWifi = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  public autoLoadOnWsCallIsDefined(value: boolean) {
    const settings = JSON.parse(localStorage.getItem('settings'));
    return settings !== null && settings.autoLoadOnWsCall !== null;
  }

  public autoLoadOnWsCallWifiIsDefined(value: boolean) {
    const settings = JSON.parse(localStorage.getItem('settings'));
    return settings !== null && settings.autoLoadOnWsCallWifi !== null;
  }

}
