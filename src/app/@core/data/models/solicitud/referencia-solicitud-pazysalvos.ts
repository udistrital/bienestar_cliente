export class ReferenciaSolicitudPazySalvo {
    Nombrecompleto: string;
    estamento: string;
    tercero: number;//id del estudiante
    codigo: number;
    documento: Number;
    //facultad: string;
    proyecto: string;
    telefono: number;
    telefonoAdicional: number;
    correo: string;
    // datos de la solicitud
    MotivoAdministrativo: string;
    MotivoPersonal: string;
    CausaPrincipal: string;
    observaciones: string="";
  //talas de areas en paz y salvo
    tabla: any = {
        apoyo:"",
        equipos:"",
        deportes:"",
        otros:"",
      };
      
}