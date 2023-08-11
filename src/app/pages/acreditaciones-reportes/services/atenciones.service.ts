import { Injectable, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { ListService } from '../../../@core/store/list.service';
import { UtilService } from '../../../shared/services/utilService'
import { environment } from '../../../../environments/environment';
import { Solicitud } from '../../../@core/data/models/solicitud/solicitud';
import { ReferenciaSolicitud } from '../../../@core/data/models/solicitud/referencia-solicitud';
import { Periodo } from '../../../@core/data/models/parametro/periodo'
import { referencia } from '../../paz-y-salvos/interfaces/index';


interface atencion{
  name:string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})



export class AtencionesService{

 //arreglos para realiza conteos
 //arreglo para vecces que se repite el servicio
 conteoServicio={}
 dataAxS:atencion[] = []//data atencion poir tipo de servicio










  

  solicitudesExt: SolicitudExt[] = [];
  // solicitudes: Solicitud[] = [];
  // filSols: Solicitud[] = [];
  // periodos: Periodo[] = [];
  // estadosTipoSolicitud: EstadoTipoSolicitud[] = [];
  // estados: Estado[] = [];
  // solicitante: Solicitante = null;
  // terceros: Tercero[] = [];
  

  estadoNum: number = null;
  periodo: number = null;
  estadoTipo: number = null;
  busqueda: string;
  pagActual: number = 1;
  contPag: number = 0;
  itemsPag: number[] = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500];
  itemSelect: number = 10;
  itemOffSet: number = 0;
  itemTipoSol: string = "activa";
  paginacion: number = 10;
  NtotalRegistros = 0;
  facultades: string[] = ["Facultad de Ingeniería", "Sede Bosa", "Facultad del Medio Ambiente y Recursos Naturales (Vivero)",
  "Facultad Tecnológica", "Facultad de Ciencias y Educación (Macarena)", "Facultad de Artes - ASAB"];
  facultad : string = ""
  //prueba para sacar datos del solicitante

  idSolicitud = 0;

  tipoAtencion: number = null;
  

  constructor(
    private listService: ListService,
    private utilService: UtilService,
  ) {

    
    this.loadPeriodo();
    this.loadEstadoTipoSolicitud();
    //this.buscarSolicitudes();

  }
  setTipoAtencion(id: number){
    this.tipoAtencion = id;
  }

  loadEstadoTipoSolicitud() {

  }

  private loadPeriodo() {

  }




   buscarSolicitudes() {
    this.cargarSol();
      
    }

  cargarSol(){
    
    Swal.fire({
      title: "Por favor espere",
      html: `Se estan cargando las solicitudes`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    
    
    this.listService.findSolicitudes(this.tipoAtencion, this.itemSelect,this.itemOffSet).then((result) => {
      console.log(result);
      this.dataAxS=[]
      this.conteoServicio=[]
        for (let solicitud of result) {
          let referencia = null;
          
          referencia = JSON.parse(solicitud.Referencia);

          //contar # que se repite el servicio
          if(this.conteoServicio[referencia["tipo_servicio"]]){
            this.conteoServicio[referencia["tipo_servicio"]]++;

          }else{
            this.conteoServicio[referencia["tipo_servicio"]]=1;
          }
         
         }
          //guardar numero de atenciones por tipo de servicio
          for (const servicio in this.conteoServicio) {
            this.dataAxS.push({ "name": servicio, "value": this.conteoServicio[servicio] });
          }
  console.log("esta es  la data",this.dataAxS);
  
       
          
          //this.dataAxS=({ name: Object.keys(this.conteoServicio),value:  Object.keys(this.conteoServicio);})
    
      // if (result != []) {
      //   this.solicitudesExt = [];
      //     console.log(result.length);
          // this.NtotalRegistros =result.length
        
      //   for (let solicitud of result) {
      //     const solext:any = new SolicitudExt(solicitud);
      //     if (this.periodo == null || this.periodos[this.periodo].Nombre == solext.Periodo) {
      //       //cargar datos de terceros de las solicitudes
      //       this.idSolicitud=solicitud.Id
      //       console.log(this.facultad);//prueba para ver si el selected funciona
            
      //       this.listService.loadSolicitanteBySolicitud(this.idSolicitud).then((respSolicitante) => {
      //         this.solicitante = respSolicitante;
      //         if (this.solicitante != undefined) {
      //             this.listService.loadTercero(this.solicitante.TerceroId).then((respTerc) => {
      //                 this.terceros.push(respTerc);
      //                 //console.log("esta es la info del tercero:",respTerc);
      //                 this.solicitudesExt.push({...solext,...respTerc});
      //             }).catch((errT) => this.utilService.showSwAlertError("Estudiante(tercero) no encontrado", errT));



      //         } else {
      //             this.utilService.showSwAlertError("Solicitante no encontrado", "No se encontro un solicitante para la solicitud");
      //         }
      //     })
      //     //console.log("esta es la info de la solictud :",this.solicitudesExt);
      //     }
      //   }
        
      //   if(this.solicitudesExt.length==0 && (this.itemOffSet<=0 || this.itemOffSet==null)){
      //     Swal.close();
      //     this.utilService.showSwAlertError('Solicitudes no encontradas','No se encontro ninguna solicitud con los parametros seleccionados.');
      //   }else if(this.solicitudesExt.length==0 && this.itemOffSet>0){
      //     Swal.close();
      //     this.utilService.showSwAlertError('Solicitudes no encontradas',
      //     'No se encontro ninguna solicitud con los parametros seleccionados <br> <b> (Puede probar dejando el punto de partida en 0 para comprobar si existen solicitudes).</b>');
      //   }else{
          Swal.close();
      //   }
        
      // } else {
      //   this.utilService.showSwAlertError("Solicitudes no encontrados", "No se encontraron solicitudes para ningun periodo");
      // }
    })
   .catch((err) => this.utilService.showSwAlertError("Error", err));
  }






  private data:atencion[] = [
    {
      name: "Enfermeria",
      value: 8940000
    },
    {
      name: "Medicina",
      value: 5000000
    },
    {
      name: "Odonologia",
      value: 7200000
    },
      {
      name: "psicologia",
      value: 6200000
    }
  ];


get atencionesData(){
  return this.data;
}
get atencionesDataAxS(){
  return this.dataAxS;
}
}
