import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    let result: string = '';
    const statuses = [
      { value: "0", viewValue: "Created" },
      { value: "1", viewValue: "Approved" },
      { value: "2", viewValue: "Delivered" },
      { value: "3", viewValue: "Cancelled" }
    ]
    result = statuses[value].viewValue;
    return result;
  }
}
