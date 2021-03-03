import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSelectModule } from '@nebular/theme';
import { ComboGenericoComponent } from './combo-generico.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ComboGenericoComponent],
  imports: [
    CommonModule,
    NbSelectModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  exports:[ComboGenericoComponent]
})
export class ComboGenericoModule { }
