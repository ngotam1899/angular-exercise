import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadSrc'
})
export class LeadSrcPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    let result: string = '';
    const leadSrc = [
      { value: "-1", viewValue: "All contracts" },
      { value: "0", viewValue: "Existing Customer" },
      { value: "1", viewValue: "Partner" },
      { value: "2", viewValue: "Conference" },
      { value: "3", viewValue: "Website" },
      { value: "4", viewValue: "Word of mouth" },
      { value: "5", viewValue: "Other" },
    ]
    result = leadSrc[+value + 1].viewValue;
    return result;
  }

}
