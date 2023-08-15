import { Injectable, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { ListService } from '../../../@core/store/list.service';
import { UtilService } from '../../../shared/services/utilService'
import { environment } from '../../../../environments/environment';
import { Solicitud } from '../../../@core/data/models/solicitud/solicitud';
import { ReferenciaSolicitud } from '../../../@core/data/models/solicitud/referencia-solicitud';
import { Periodo } from '../../../@core/data/models/parametro/periodo'
import { referencia } from '../../paz-y-salvos/interfaces/index';
import { Solicitante } from '../../../@core/data/models/solicitud/solicitante';



interface atencion{
  name:string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})



export class AtencionesService{

 //arreglos para realiza conteos
 atenciones = []
 solicitantes = []

 //solicitantes = []
 //arreglo para vecces que se repite el servicio
 conteoServicio={}
 conteoFacultades=[]

 dataAxS:atencion[] = []//data atencion poir tipo de servicio
 dataAxF:atencion[] = []// data de atenciones por facultad


 itemSelect: number = 10;
 itemOffSet: number = 0;
 tipoAtencion: number = null;
  

  constructor(
    private listService: ListService,
    private utilService: UtilService,
  ) {

    //this.buscarSolicitudes();

  }
  setTipoAtencion(id: number){
    this.tipoAtencion = id;
  }

  buscarSolicitudes() {
    this.cargarSol();
    }

  cargarSolicitantes(solicitudes){
    this.solicitantes=[]
    for (let solicitud of solicitudes) {
      this.listService.loadSolicitanteBySolicitud(solicitud.Id).then((solicitante) => {
        this.solicitantes=this.solicitantes.concat(solicitante);
       if(this.solicitantes.length == this.atenciones.length){ this.cargarFacultades(this.solicitantes)}  })
    }
  }

  cargarFacultades(solicitante){
    let aux =[]
    let facultad =""
    this.dataAxF=[]
    let data=[]
    this.conteoFacultades=[]
    const  ids= [9885,9886]
    for (let solicitud of solicitante) {   //descoemntar pa entregar
      console.log("id del estudiante",solicitud);// para msotrar datos del estudiante de aqui se saca el id
     this.listService.loadFacultadProyectoTercero(9885).then((facultades) => { //cambiar el # por soliciante.terceroId
      facultad = facultades[0]
      aux = aux.concat(facultades[0])
      //console.log("esta es la facultad", facultad)
      if(this.conteoFacultades[facultad]){
         this.conteoFacultades[facultad]++;
        }else{
          this.conteoFacultades[facultad]=1;
          //console.log(this.conteoFacultades);
        }  
      if(aux.length == solicitante.length){
       // console.log("ta esta iual",this.conteoFacultades);
        for (const servicio in this.conteoFacultades) {
          data.push({ "name": servicio, "value": this.conteoFacultades[servicio] });
        }
        
        //return this.dataAxF
        this.dataAxF=data
        console.log("esta es  la data de las facultades ",this.dataAxF);
      }

    }).catch((errT) => this.utilService.showSwAlertError("Error en las busqueda de faultades", errT));

    }       
  }

  cargarSol(){
    
    // Swal.fire({
    //   title: "Por favor espere",
    //   html: `Se estan cargando las solicitudes`,
    //   allowOutsideClick: false,
    //   showConfirmButton: false,
    // });
    // Swal.showLoading();
    
    
    this.listService.findSolicitudes(this.tipoAtencion, this.itemSelect,this.itemOffSet).then((result) => {
      console.log(result);
      this.atenciones = result;
      this.dataAxS=[]
      this.conteoServicio=[]

      // for para sacar data de tipo de servicio 
        for (let solicitud of result) {
          let referencia = null;
          //console.log(solicitud["Id"]);
          referencia = JSON.parse(solicitud.Referencia);

          //contar # que se repite el servicio
          if(this.conteoServicio[referencia["tipo_servicio"]]){
            this.conteoServicio[referencia["tipo_servicio"]]++;

          }else{
            this.conteoServicio[referencia["tipo_servicio"]]=1;
          }
         
        }
        
        //console.log("conteo servico,",this.conteoServicio);
          //guardar numero de atenciones por tipo de servicio
        for (const servicio in this.conteoServicio) {
          this.dataAxS.push({ "name": servicio, "value": this.conteoServicio[servicio] });
        }
        console.log("esta es  la data de servicios ",this.dataAxS);
        
        console.log(this.dataAxS.length);
        
  

   /// for para tratar de encontrar solicitante 
      const facultades =  this.cargarSolicitantes(this.atenciones)
      
    
       
        
        // for (const facultad in this.conteoFacultades) {
        //   console.log("i",facultad);
          
        //   this.dataAxF.push({ "name": facultad, "value": this.conteoFacultades[facultad] });
        // }
        


            // this.listService.loadTercero(this.solicitante.TerceroId).then((respTerc) => {
            //     this.terceros.push(respTerc);
            //     //console.log("esta es la info del tercero:",respTerc);
            //     this.solicitudesExt.push({...solext,...respTerc});
            // }).catch((errT) => this.utilService.showSwAlertError("Estudiante(tercero) no encontrado", errT));

          

   //}

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

      //   }
        
      // } else {
      //   this.utilService.showSwAlertError("Solicitudes no encontrados", "No se encontraron solicitudes para ningun periodo");
      // }
    }).catch((err) => this.utilService.showSwAlertError("Error", err));
 
   
  }






  private data2:atencion[] = [
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



get atencionesDataAxS(){
  return this.dataAxS;
}
get atencionesDataAxF(){
  return this.dataAxF;
}
}
