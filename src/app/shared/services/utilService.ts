import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class UtilService {

    constructor() { }

 /*    submitAlert({ option, type, fn, data, info, fnReturn }) {
        Swal.fire({
            title: `Se ${option === 'update' ? 'actualizará' : 'creará'} ${type}`,
            text: info,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: `${option === 'update' ? 'Actualizar' : 'Crear'} ${type}`
        })
            .then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: 'Por favor espere!',
                        html: `${option === 'update' ? 'Actualizando' : 'Creando'} ${type}`,
                        allowOutsideClick: false,
                        willOpen: () => {
                            Swal.showLoading()
                        },
                    });
                    fn(data)
                        .then((response) => {
                            Swal.close();
                            Swal.fire(
                                `${option === 'update' ? 'Actualizado' : 'Creado'}`,
                                `Se ha ${option === 'update' ? 'actualizado' : 'Creado'}  ${type} ${response} de forma exitosa`,
                                'success'
                            ).then((data2) => {
                                fnReturn();
                            })
                        })
                        .catch(err => {
                            Swal.close();
                            Swal.fire(
                                `No se ha podido ${option === 'update' ? 'Actualizar' : 'Crear'}  ${type}`,
                                `error: ${err}`,
                                'error'
                            )
                        })
                }
            })
    } */

    async termsAndConditional() {
        const { value: accept } =  await Swal.fire({
            input: 'checkbox',
            html:`
            <h3 class="title-term-conditional">Terminos y condiciones</h3>
            <p class="text-term-condional">El manejo de la información contenida en el presente formulario,  es de tipo confidencial y su uso es estrictamente institucional, en cumplimiento de lo establecido en el artículo décimo quinto constitucional, así como en la Ley 1581 de 2012 y los decretos reglamentarios de ésta, tales como el Decreto 1377 de 2013, la Universidad Distrital Francisco José de Caldas adopta la Política de Tratamiento y Protección de Datos Personales, que será aplicable a todas las personas naturales con las cuales la Universidad entre en contacto, en razón de sus funciones, a fin de que ejerzan su derecho a conocer, actualizar y/o rectificar la información que sobre ellas repose en las bases de datos de la entidad. También regula las actividades de recolección, tratamiento y circulación de estos datos, a cargo de la Universidad.
      Así mismo, la anterior información es solicitada en el marco de la pandemia por COVID-19, cumpliendo con los lineamientos establecidos por la Resolución 666 de 2020 y otros lineamentos normativos del gobierno, como la adopción del Protocolo de la universidad por medio de la Resolución 176 de 2020.
      Agradecemos que la información acá suministrada sea veraz y oportuna, ya que, con su registro, se certifica las condiciones de salud en las que se encuentra la persona autorizada para ingresar a la sede o dependencia.</p>`,
            inputPlaceholder: "Acepto términos y condiciones",
            confirmButtonText:
                'Continue&nbsp;<i class="fa fa-arrow-right"></i>',
            inputValidator: (result) => {
                return !result && `Necesita aceptar términos y condiciones para continuar`
            }
        })
        if (accept) {
            Swal.fire('You agreed with T&C :)')
        }
        return !!accept;       
    }
}

