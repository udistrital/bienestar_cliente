import { Component, OnInit } from '@angular/core';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { GrupoCultural } from '../../../../@core/data/models/cultura/grupo_cultural';


@Component({
  selector: 'ngx-ver-grupos-culturales',
  templateUrl: './ver-grupos-culturales.component.html',
  styleUrls: ['./ver-grupos-culturales.component.scss']
})
export class VerGruposCulturalesComponent implements OnInit {

  logoGrupos = [];
  gruposCulturales: any[] = [];
  nombreArchivo = '';
  nombreGrupo ='';
  base64String: string;

  imagesSrc: any[] = [];
  imageSrc: any;

  constructor(private ListCultura: CulturaService,
              private sanitizer:DomSanitizer ) { }

  ngOnInit() {
    
    this.listarGruposActivos();
          
  }

  listarGruposActivos(){
    this.ListCultura.getGruposCulturalesActivos().subscribe((data)=>{      
      /*
      const peticiones = gruposActivos.map((grupo: any) => {
        return this.ListCultura.getDocumento(grupo.Imagen);
      });

      forkJoin(peticiones).subscribe((respuestas: any[]) => {
        // Asignar el dato 'File' de cada respuesta al grupo correspondiente
        respuestas.forEach((respuesta, index) => {
          gruposActivos[index].File = respuesta['dc:File'];
      });
      */
        for (let i in data['Data']){

          let grupoCultural: GrupoCultural = new GrupoCultural();

          grupoCultural.Id = data['Data'][i].Id;
          grupoCultural.Nombre = data['Data'][i].Nombre;

          this.gruposCulturales.push(grupoCultural);

          this.ListCultura.getDocumento(data['Data'][i].Imagen).subscribe((data2) => {
            this.base64String = data2['file'];
            this.imageSrc = this.convertBase64ToImageSrc(this.base64String);
            this.imagesSrc.push(this.imageSrc);
          });

        }
      
    }); 

    

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
  

}


