import {Inject, Injectable} from '@angular/core';
import {WINDOW} from '../provider/window.provider';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(@Inject(WINDOW) private window: Window) {
  }

  public get autoLoadOnWsCall() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      return true;
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


  public get autoLoadOnWsCallIsDefined() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    return settings !== null && settings.autoLoadOnWsCall !== null;
  }


  public get autoLoadOnWsCallWifiOnly() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      return false;
    }

    return settings.autoLoadOnWsCallWifi;
  }

  public set autoLoadOnWsCallWifiOnly(value: boolean) {
    let settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      settings = {};
    }

    settings.autoLoadOnWsCallWifiOnly = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  public isAllowedByWiFi() {
    if (this.autoLoadOnWsCallWifiOnly) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const type = connection.effectiveType;

      return type === 'wifi' || 'ethernet';
    }
    return true;
  }
}
