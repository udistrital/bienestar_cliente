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
    observaciones?: string;
    apoyoAlimentario?: string;
    equiposConectividad?: string;
    deportes?: string;
}