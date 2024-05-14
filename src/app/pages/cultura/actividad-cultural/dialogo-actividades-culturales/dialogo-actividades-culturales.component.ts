import { Component, Inject, OnInit } from '@angular/core';
import { ActividadCultural } from '../../../../@core/data/models/cultura/actividad_cultural';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { DatePipe, formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

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

  base64String: string;
  imageSrc: any;

  constructor(public dialogRef: MatDialogRef<DialogoActividadesCulturalesComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private ListCultura: CulturaService,
    private datePipe: DatePipe, private sanitizer:DomSanitizer) 
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

      this.obtenerImagen(data['Data'].Imagen);

      this.cargarGruposParticipantes(this.id);

      this.fechaInicio = this.formatearFecha(this.actividadCultural.FechaInicio);
      this.fechaFin = this.formatearFecha(this.actividadCultural.FechaFin);
      this.enlaceInscripcion = this.actividadCultural.EnlaceInscripcion;
      this.enlaceMayorInfo = this.actividadCultural.EnlaceMayorInfo;
  
      this.convertirNecesitaInscripcion(this.actividadCultural.NecesitaInscripcion);
      this.convertirMayoInfo(this.actividadCultural.PoseeMayorInfo);

    });
  }

  obtenerImagen(enlace: string){
    this.ListCultura.getDocumento(enlace).subscribe((data2)=>{
      this.base64String = data2['file'];
      this.imageSrc = this.convertBase64ToImageSrc(this.base64String);
    })
  }

  convertBase64ToImageSrc(base64String: string): any {
    // Convertir la cadena base64 a una URL de objeto
    const imageBlob = this.base64ToBlob(base64String, 'image/png');
    const imageUrl = URL.createObjectURL(imageBlob);
    // Sanitizar la URL para prevenir problemas de seguridad
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  base64ToBlob(base64String: string, type: string): Blob {
    // Obtener el contenido binario de la cadena base64
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    // Crear un objeto Blob a partir de los byteArrays
    return new Blob(byteArrays, { type: type });
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
      this.isEnlaceMayorInfo = true;
      return this.actividadCultural.EnlaceMayorInfo;
    } else {
      this.isEnlaceMayorInfo = false;
      return 'No hay enlace para mayor información';
    }
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
