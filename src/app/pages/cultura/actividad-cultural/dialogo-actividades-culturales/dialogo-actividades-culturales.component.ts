import { Component, Inject, OnInit } from '@angular/core';
import { ActividadCultural } from '../../../../@core/data/models/cultura/actividad_cultural';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'ngx-dialogo-actividades-culturales',
  templateUrl: './dialogo-actividades-culturales.component.html',
  styleUrls: ['./dialogo-actividades-culturales.component.scss']
})
export class DialogoActividadesCulturalesComponent implements OnInit {

  id: number;
  actividadCultural: ActividadCultural = new ActividadCultural();
  gruposCulturalesParticipantes: any[] = [];
  fechaActual = new Date();

  isRegistrado: boolean = false;
  isEnlaceInscripcion: boolean = false;
  isEnlaceMayorInfo: boolean = false;

  fechaInicio: string;
  fechaFin: string;
  enlaceInscripcion: string;
  enlaceMayorInfo: string;

  constructor(public dialogRef: MatDialogRef<DialogoActividadesCulturalesComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private ListCultura: CulturaService,
    private datePipe: DatePipe) 
  { 
    this.id = data.mensaje['idActividad']; 
    this.fechaActual.setDate(this.fechaActual.getDate());
  }

  ngOnInit() {
    this.cargarInfoActividadCultural();
  }

  cargarInfoActividadCultural(){
    this.ListCultura.getActividadCultural(this.id).subscribe((data) => {

      this.actividadCultural = data['Data'];

      if(this.actividadCultural.Estado == 1){
        this.isRegistrado = true;
      } else {
        this.cargarGruposParticipantes(this.id);

        this.fechaInicio = this.formatearFecha(this.actividadCultural.FechaInicio);
        this.fechaFin = this.formatearFecha(this.actividadCultural.FechaFin);
        this.enlaceInscripcion = this.actividadCultural.EnlaceInscripcion;
        this.enlaceMayorInfo = this.actividadCultural.EnlaceMayorInfo;
  
        this.convertirNecesitaInscripcion(this.actividadCultural.NecesitaInscripcion);
        this.convertirMayoInfo(this.actividadCultural.PoseeMayorInfo);
      } 

    });
  }

  cargarGruposParticipantes(idActividad: number){
    this.ListCultura.getGruposCulturalesParticipantes(idActividad).subscribe((data) => {

      for(let i in data['Data']){
        console.log(data['Data'][i].IdGrupoCultural.Id);
        this.ListCultura.getGrupoCultural(data['Data'][i].IdGrupoCultural.Id).subscribe((res) => {
          const nuevaFila = {
            Nombre: [res['Data'].Nombre]
          };
          this.gruposCulturalesParticipantes.push(nuevaFila);
        });
      }
      
    });
  }

  convertirEstado(estado: number){
    if(estado == 1) {
      return 'Registrado';
    } else if(estado == 2) {
      return 'En planeación';
    } else if(estado == 3) {
      return 'En ejecución';
    } else if(estado == 4) {
      return 'finalizado';
    } else if(estado == 5) {
      return 'Cerrado';
    } else if(estado == 6) {
      return 'Suspendido';
    } else if(estado == 7) {
      return 'Cancelado';
    }
  }

  convertirTipoActividad(actividad: number){
    if(actividad == 1) {
      return 'Evento';
    } else if (actividad == 2) {
      return 'Ensayo';
    } else if (actividad == 3) {
      return 'Taller';
    } else if (actividad == 4) {
      return 'Conversatorio';
    }
  }

  formatearFecha(fecha: string){
    return formatDate(fecha, 'yyyy-MM-dd HH:mm', 'en');
  }

  formatearNecesitaInscripcionMayorInfo(opt: number): string{
    if(opt == 1){
      return 'Si';
    } else {
      return 'No';
    }
  }

  convertirNecesitaInscripcion(necesitaInscripcion: number){
    if (necesitaInscripcion == 1) {
      this.isEnlaceInscripcion =  true;
    } else {
      this.isEnlaceInscripcion = false;
    }
  }

  convertirMayoInfo(mayorInfo: number){
    if (mayorInfo == 1) {
      
      return this.actividadCultural.EnlaceMayorInfo;
    } else {
      return 'No hay enlace para mayor información';
    }
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
