import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPaginatorComponent } from './custom-paginator.component';
import { NbButtonModule } from '@nebular/theme';



@NgModule({
  declarations: [CustomPaginatorComponent],
  imports: [
    CommonModule,
    NbButtonModule,
  ],
  exports: [CustomPaginatorComponent]
})
export class CustomPaginatorModule { }
