export let FORM_FUENTE = {

    tipo_formulario: 'mini',
    titulo: 'Fuente Financiamiento',
    btn: 'Guardar',
    alertas: true,
    modelo: 'FuenteFinanciamiento',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
            nombre: 'Area Funcional',
            label_i18n: 'area_funcional',
            placeholder_i18n: 'area_funcional',
            deshabilitar: true,
            requerido: false,
            valor: '01 - Rector',
            tipo: 'text',
            prefix: {
                value: '01 - Rector',
            }
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
            nombre: 'Centro Gestor',
            label_i18n: 'centro_gestor',
            placeholder_i18n: 'centro_gestor',
            deshabilitar: true,
            requerido: false,
            valor: '230 - UNIVERSIDAD DISTRITAL',
            tipo: 'text',
            prefix: {
                value: '230 - UNIVERSIDAD DISTRITAL',
            }
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'Codigo',
            label_i18n: 'codigo',
            deshabilitar: false,
            placeholder_i18n: 'codigo',
            requerido: true,
            length: '10',
            tipo: 'text',
            prefix: {
                value: '',
            },
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'Nombre',
            label_i18n: 'nombre',
            placeholder_i18n: 'nombre',
            requerido: true,
            tipo: 'text',
        },
        {
            etiqueta: 'textarea',
            claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
            nombre: 'Descripcion',
            label_i18n: 'descripcion',
            placeholder_i18n: 'descripcion',
            requerido: true,
            tipo: 'text',
        }
    ],
};
