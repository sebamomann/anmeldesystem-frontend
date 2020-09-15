import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() {
  }

  private _message$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public get message$(): BehaviorSubject<string> {
    return this._message$;
  }

  public set message(value: string) {
    this._message$.next(value);
  }

  private _messageSec$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public get messageSec$(): BehaviorSubject<string> {
    return this._messageSec$;
  }

  public set messageSec(value: string) {
    this._messageSec$.next(value);
  }
}
