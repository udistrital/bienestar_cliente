import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormat'
})
export class FechaFormatPipe implements PipeTransform {
 
  /**
     *
     * Valida una fecha para que se muestre en la vista correctamente.
     * 
     * @param value
     * @param typeTransform
     * 
     */  
  transform(value: any, typeTransform?: any): any {
    if(value) {
      //return dateString.replace(/\s/, 'T');    
      let datePipe = new DatePipe('en-US');
      let dateCreated:string="";
      for(let i of value){
        if(i=='+'){
          break;
        }else if (i==' '){
          dateCreated+='T';
        }
        else{
          dateCreated+=i;
        }
      }
      dateCreated = dateCreated.slice(0, -1);   
      //dateCreated=dateCreated.toString();
      if(typeTransform==null){
        return datePipe.transform(dateCreated,'yyyy-MM-dd');
      }else{
        return datePipe.transform(dateCreated,typeTransform);
      }
      
    }
    return null;
  }

}
