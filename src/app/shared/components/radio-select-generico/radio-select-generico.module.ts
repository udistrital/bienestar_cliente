import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioSelectGenericoComponent } from './radio-select-generico.component';
import { NbRadioModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RadioSelectGenericoComponent],
  imports: [
    CommonModule,
    NbRadioModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  exports:[RadioSelectGenericoComponent],
})
export class RadioSelectGenericoModule { }
