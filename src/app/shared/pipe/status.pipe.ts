import { Pipe, PipeTransform } from '@angular/core';
import { statuses } from '../constants';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    let result: string = '';
    result = statuses[+value + 1].viewValue;
    return result;
  }
}
