import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputGenericoComponent } from './input-generico.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule } from '@nebular/theme';



@NgModule({
  declarations: [InputGenericoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
  ],
  exports: [InputGenericoComponent]
})
export class InputGenericoModule { }
