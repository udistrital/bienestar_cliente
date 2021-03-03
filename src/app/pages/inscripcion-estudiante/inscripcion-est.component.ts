import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {ImplicitAutenticationService} from '../../@core/utils/implicit_autentication.service';
import {ReliquidacionHelper} from '../../@core/helpers/reliquidacion/reliquidacionHelper';
import { IncripcionEstudianteService } from '../../shared/services/incripcion-estudiante.service';
import { ApiConstanst } from '../../shared/constants/api.constans';

@Component({
    selector: 'ngx-inscripcion-est',
    styleUrls: ['./inscripcion-est.component.scss'],
    templateUrl: './inscripcion-est.component.html',
})
export class InscripcionEstComponent implements OnInit {
    facultades: Array<string> = ['ARTES ASAB', 'CIENCIAS Y EDUCACIÓN'];
    proyectos: Array<string> = ['Sistematizacion de datos', 'Industrial', 'Eléctrica', 'Mecánica'];
    localidades: Array<string> = ['Bosa', 'Usme', 'Ciudad Bolivar', 'Kennedy'];
    municipios: Array<string> = ['Bogota', 'Sumapaz', 'Otros'];
    estadocivil: Array<string> = ['Soltero', 'Casado', 'Separado'];

    registro: FormGroup;
    residencia: FormGroup;
    socioeconomica: FormGroup;
    colegio: FormGroup;
    vivienda: FormGroup;
    futurofort: FormGroup;
    documentos: FormGroup;
    doccertificadoingreso: FormGroup;
    peracargo: FormGroup;
    registrocivil: FormGroup;
    desplazado: FormGroup;
    recibopago: FormGroup;
    otrosdoc: FormGroup;
    @ViewChild('dialogo', {read: null, static: null}) dialogo: TemplateRef<any>;

    estudiante: any;

    APP_CONSTANTS = ApiConstanst;

    constructor(private httpClient: HttpClient, private dialog: MatDialog,
                private reliquidacionHelper: ReliquidacionHelper,
                private autenticacion: ImplicitAutenticationService,
                private inscripcionEstudianteService: IncripcionEstudianteService,
                ) {

        this.registro = new FormGroup({
            codigo: new FormControl(),
            facultad: new FormControl(),
            proyecto: new FormControl(),
            nombres: new FormControl(),
            id: new FormControl(),
            edad: new FormControl(),
        });

        this.residencia = new FormGroup({
            barrio: new FormControl(),
            direccion: new FormControl(),
            telefono: new FormControl(),
            email: new FormControl(),
        });

        this.socioeconomica = new FormGroup({
            ingresosmensuales: new FormControl(),
            ing_mesual: new FormControl(),
            descDis: new FormControl(),
        });

        this.colegio = new FormGroup({
            pension: new FormControl(),
        });

        this.vivienda = new FormGroup({});

        this.futurofort = new FormGroup({});

        this.documentos = new FormGroup({});

        this.doccertificadoingreso = new FormGroup({});

        this.peracargo = new FormGroup({});

        this.registrocivil = new FormGroup({

            edad: new FormControl(),
            numero_hijos: new FormControl(),

        });
        this.desplazado = new FormGroup({});

        this.recibopago = new FormGroup({

            valor_matricula: new FormControl(),

        });
        this.otrosdoc = new FormGroup({});
    }

    ngOnInit() {
        const user: string = ((this.autenticacion.getPayload()).email.split('@')).shift();

        const estudiante = {
            user: user
        };

        this.reliquidacionHelper.getEstudiante(estudiante).subscribe((res) => {
            this.estudiante = res;
        });
    }

    sendData(form: NgForm) {
        // console.log(form);

        /*this.httpClient.post('url', {}, {}).subscribe(
          value => console.log(value),
        );*/
    }

    llamardialogo() {
        this.dialog.open(this.dialogo);
    }
}
