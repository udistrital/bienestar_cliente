export let DETALLE_MODIFICACION_FORM = {

    tipo_formulario: 'mini',
    alertas: true,
    modelo: 'detalleModificacion',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'mx-auto col-lg-7 col-md-7 col-sm-7 col-xs-7',
            nombre: 'nOficio',
            label_i18n: 'N° Oficio',
            placeholder_i18n: 'N° Oficio',
            requerido: true,
            tipo: 'text',
        },
        {
            etiqueta: 'mat-date',
            claseGrid: 'mx-auto col-lg-7 col-md-7 col-sm-7 col-xs-7',
            nombre: 'fOficio',
            label_i18n: 'Fecha Del Oficio',
            placeholder_i18n: 'Fecha Del Oficio',
            requerido: true,
        },
        {
            etiqueta: 'textarea',
            claseGrid: 'mx-auto col-lg-7 col-md-7 col-sm-7 col-xs-7',
            nombre: 'Descripcion',
            label_i18n: 'Descripción',
            placeholder_i18n: 'Descripción',
            requerido: false,
            tipo: 'text',
        },
    ],
};
