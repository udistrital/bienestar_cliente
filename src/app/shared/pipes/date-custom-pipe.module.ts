import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateCustomPipePipe } from './date-custom-pipe.pipe';



@NgModule({
  declarations: [DateCustomPipePipe],
  imports: [
    CommonModule
  ],
  exports: [DateCustomPipePipe]
})
export class DateCustomPipeModule { }
