import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
  }

  public get autoLoadOnWsCall() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null || settings.autoLoadOnWsCall === undefined) {
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

    if (settings === null || settings.autoLoadOnWsCallWifiOnly === undefined) {
      return false;
    }

    return settings.autoLoadOnWsCallWifiOnly;
  }

  public set autoLoadOnWsCallWifiOnly(value: boolean) {
    let settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      settings = {};
    }

    settings.autoLoadOnWsCallWifiOnly = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  public get autoPinAppointment() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null || settings.autoPinAppointment === undefined) {
      return true;
    }

    return settings.autoPinAppointment;
  }

  // PINNING

  public set autoPinAppointment(value: boolean) {
    let settings = JSON.parse(localStorage.getItem('settings'));

    if (settings === null) {
      settings = {};
    }

    settings.autoPinAppointment = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  public isAllowedByWiFi() {
    if (this.autoLoadOnWsCallWifiOnly) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const type = connection.effectiveType;

      console.log('Connection-Type: ' + type);

      return type === 'wifi' || type === 'ethernet';
    }
    return true;
  }
}
