import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'urlEncode'
})
export class UrlEncodePipe implements PipeTransform {

  static forRoot() {
    return {
      ngModule: UrlEncodePipe,
      providers: [],
    };
  }

  transform(value: any, ...args: any[]): any {
    return encodeURI(value);
  }

}
