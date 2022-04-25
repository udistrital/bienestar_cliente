import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCustomPipe'
})
export class DateCustomPipePipe extends
  DatePipe implements PipeTransform {

  transform(value: any): any {
    const fechaAux = super.transform(value, 'yyyy-MM-dd HH:mm:ss.SSS').toString();
    return `${fechaAux} +0000 +0000`;
  }

}
