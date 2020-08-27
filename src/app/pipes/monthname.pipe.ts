import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'monthname'
})
export class MonthnamePipe implements PipeTransform {

  private MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  constructor() {
  }

  transform(value: any, ...args: any[]): any {
    return this.MONTH_NAMES[value];
  }

}
