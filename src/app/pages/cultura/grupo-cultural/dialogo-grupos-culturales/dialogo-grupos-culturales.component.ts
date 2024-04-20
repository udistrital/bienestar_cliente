import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';
import { DatePipe,formatDate } from '@angular/common';
import { HorarioGrupoCultural } from '../../../../@core/data/models/cultura/horarios_grupo_cultural';
import { DomSanitizer } from '@angular/platform-browser';

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
  fechaFormatCreacion: Date;
  enlaceInscripcion: string;
  valInscripcion: boolean = false;
  base64String: string;
  imageSrc: any;
  umbralAncho = 650;

  constructor(public dialogRef: MatDialogRef<DialogoGruposCulturalesComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private ListCultura: CulturaService,
    private datePipe: DatePipe, private sanitizer:DomSanitizer) 
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

      this.obtenerImagen(data['Data'].Imagen);
      this.enlaceInscripcion = this.grupo_cultural.EnlaceInscripcion;
      this.formatearFechaInicio();
      this.formatearFechaFin();
      this.formatearFechaCreacion();

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

  formatearFechaInicio(){
    this.fechaFormatIni = new Date(formatDate(this.grupo_cultural.FechaInicioInscripcion, 'yyyy-MM-dd', 'en'));
  }

  obtenerFechaInicio(): string{
    if(this.grupo_cultural.NecesitaInscripcion == 1){
      return this.datePipe.transform(this.fechaFormatIni, 'yyyy-MM-dd');
    } else {
      return 'No hay fecha de inicio de inscripcion registrada'
    }
    
  }

  formatearFechaFin(){
    this.fechaFormatFin = new Date(formatDate(this.grupo_cultural.FechaFinInscripcion, 'yyyy-MM-dd', 'en'));
  }

  obtenerFechaFin(): string{
    if(this.grupo_cultural.NecesitaInscripcion == 1){
      return this.datePipe.transform(this.fechaFormatFin, 'yyyy-MM-dd');
    } else {
      return 'No hay fecha de finalizaciòn de inscripcion registrada'
    }
  }

  formatearFechaCreacion(){
    this.fechaFormatCreacion = new Date(formatDate(this.grupo_cultural.FechaCreacion, 'yyyy-MM-dd HH:mm', 'en'));
  }

  obtenerFechaCreacion(){
    return this.datePipe.transform(this.fechaFormatCreacion, 'yyyy-MM-dd HH:mm');
  }

  close(): void {
    this.dialogRef.close(true);
  }

}
