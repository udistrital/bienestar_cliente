export let DETALLE_MODIFICACION_FORM = {

    tipo_formulario: 'mini',
    alertas: true,
    modelo: 'detalleModificacion',
    btn: 'GLOBAL.siguiente_abr',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'mx-auto col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'nDocumento',
            label_i18n: 'numero_documento',
            placeholder_i18n: 'numero_documento',
            requerido: true,
            tipo: 'number',
        },
        {
            etiqueta: 'select',
            claseGrid: 'mx-auto col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'tipoDocumento',
            label_i18n: 'tipo_documento',
            placeholder_i18n: 'tipo_documento',
            requerido: true,
            opciones: [],
            show_field: 'Nombre'
        },
        {
            etiqueta: 'mat-date',
            claseGrid: 'mx-auto col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'fDocumento',
            label_i18n: 'fecha_documento',
            placeholder_i18n: 'fecha_documento',
            requerido: true,
        },
        {
            etiqueta: 'textarea',
            claseGrid: 'mx-auto col-lg-7 col-md-7 col-sm-7 col-xs-7',
            nombre: 'descripcion',
            label_i18n: 'descripcion',
            placeholder_i18n: 'descripcion',
            requerido: true,
            tipo: 'text',
        },
    ],
};
