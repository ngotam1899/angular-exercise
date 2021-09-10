import { Pipe, PipeTransform } from '@angular/core';
import { leadSrcs } from '../constants';

@Pipe({
  name: 'leadSrc'
})
export class LeadSrcPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    let result: string = '';
    result = leadSrcs[+value + 1].viewValue;
    return result;
  }

}
