import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';
import { DatePipe,formatDate } from '@angular/common';
import { HorarioGrupoCultural } from '../../../../@core/data/models/cultura/horarios_grupo_cultural';

@Component({
  selector: 'ngx-dialogo-grupos-culturales',
  template: `<h1> Ventana Modal </h1> <button (click)="close()">Cerrar</button>`,
  templateUrl: './dialogo-grupos-culturales.component.html',
  styleUrls: ['./dialogo-grupos-culturales.component.scss']
})
export class DialogoGruposCulturalesComponent implements OnInit {

  id: number;
  grupo_cultural: GrupoCultural = new GrupoCultural();
  horarios_gr: any[] = [];
  fechaActual = new Date();
  fechaFormatIni: Date;
  fechaFormatFin: Date;
  enlaceInscripcion: string;
  valInscripcion: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogoGruposCulturalesComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private ListCultura: CulturaService,
    private datePipe: DatePipe) 
  { 
    this.id = data.mensaje['idGrupo']; 
    this.fechaActual.setDate(this.fechaActual.getDate());
  }


  ngOnInit(){
    this.cargarInfoGrupoCultural();
  }

  cargarInfoGrupoCultural(){

    this.ListCultura.getGrupoCultural(this.id).subscribe((data) => {

      this.grupo_cultural = data['Data'];

      this.enlaceInscripcion = this.grupo_cultural.EnlaceInscripcion;
      this.formatearFechaInicio(this.grupo_cultural.FechaInicioInscripcion);
      this.formatearFechaFin(this.grupo_cultural.FechaFinInscripcion);

      this.cargarHorariosGrupoCultural(this.grupo_cultural.Id);
      this.obtenerEnlaceInscripcion();
    });

  }

  cargarHorariosGrupoCultural(idGrupoCultural: number){

    this.ListCultura.getHorariosGrupoCultural(idGrupoCultural).subscribe((data) => {

      for (let i in data['Data']){

        const nuevaFila = {
          id: [data['Data'][i].Id],
          dia: [data['Data'][i].DiaReunion],
          hora: [data['Data'][i].HoraReunion],
          lugar: [data['Data'][i].LugarReunion],
        };
        this.horarios_gr.push(nuevaFila);
      
      }

    });

  }

  formatearEstado(estado: number): string{
    if(estado == 1){
      return 'Activo';
    } else {
      return 'Inactivo'
    }
  }

  formatearNecesitaInscripcion(necesitaInscripcion: number): string{
    if(necesitaInscripcion == 1){
      return 'Si';
    } else {
      return 'No';
    }
  }

  obtenerEnlaceInscripcion(){
    
    if(this.grupo_cultural.NecesitaInscripcion == 0){
      this.enlaceInscripcion = 'Sin enlace de inscripción';
    } else if (this.grupo_cultural.NecesitaInscripcion == 1 && (this.fechaActual < this.fechaFormatIni || this.fechaActual > this.fechaFormatFin)){
      this.enlaceInscripcion =  'Enlace de inscripcion no habilitado';
    } else {
      this.valInscripcion = true;
      this.enlaceInscripcion =  this.grupo_cultural.EnlaceInscripcion;
    }
  }

  formatearFechaInicio(fechaInicio: string){
    this.fechaFormatIni = new Date(formatDate(this.grupo_cultural.FechaInicioInscripcion, 'yyyy-MM-dd', 'en'));
  }

  obtenerFechaInicio(): string{
    if(this.grupo_cultural.NecesitaInscripcion == 1){
      return this.datePipe.transform(this.fechaFormatIni, 'yyyy-MM-dd');
    } else {
      return 'No hay fecha de inicio de inscripcion registrada'
    }
    
  }

  formatearFechaFin(fechaInicio: string){
    this.fechaFormatFin = new Date(formatDate(this.grupo_cultural.FechaFinInscripcion, 'yyyy-MM-dd', 'en'));
  }

  obtenerFechaFin(): string{
    if(this.grupo_cultural.NecesitaInscripcion == 1){
      return this.datePipe.transform(this.fechaFormatFin, 'yyyy-MM-dd');
    } else {
      return 'No hay fecha de finalizaciòn de inscripcion registrada'
    }
  }

  close(): void {
    this.dialogRef.close(true);
  }

}
