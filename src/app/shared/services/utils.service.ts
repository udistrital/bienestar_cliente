import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public static crearQueryParams(queryParams: any): any{
    return Object.keys(queryParams)
    .map(key => `${key}=${queryParams[key]}`)
    .join('&');
  }


  public static parseDate(value: any): any{
    let valueCopy = value;
    valueCopy = valueCopy.replace(' +0000 +0000','');
    return new Date(valueCopy);
  }
}
