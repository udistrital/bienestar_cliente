export let DETALLE_MODIFICACION_FORM = {

    tipo_formulario: 'mini',
    alertas: true,
    modelo: 'detalleModificacion',
    btn: 'GLOBAL.siguiente',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'mx-auto col-lg-8 col-md-8 col-sm-8 col-xs-8',
            nombre: 'NumeroDocumento',
            label_i18n: 'numero_documento',
            placeholder_i18n: 'numero_documento',
            requerido: true,
            tipo: 'text',
        },
        {
            etiqueta: 'select',
            claseGrid: 'mx-auto col-lg-8 col-md-8 col-sm-8 col-xs-8',
            nombre: 'TipoDocumento',
            label_i18n: 'tipo_documento',
            placeholder_i18n: 'tipo_documento',
            requerido: true,
            opciones: [],
            show_field: 'Nombre'
        },
        {
            etiqueta: 'mat-date',
            claseGrid: 'mx-auto col-lg-8 col-md-8 col-sm-8 col-xs-8',
            nombre: 'FechaDocumento',
            label_i18n: 'fecha_documento',
            placeholder_i18n: 'fecha_documento',
            requerido: true,
        },
        {
            etiqueta: 'input',
            claseGrid: 'mx-auto col-lg-8 col-md-8 col-sm-8 col-xs-8',
            nombre: 'OrganismoEmisor',
            label_i18n: 'organismo_emisor',
            placeholder_i18n: 'organismo_emisor',
            requerido: true,
            tipo: 'text',
        },
        {
            etiqueta: 'textarea',
            claseGrid: 'mx-auto col-lg-8 col-md-8 col-sm-8 col-xs-8',
            nombre: 'Descripcion',
            label_i18n: 'descripcion',
            placeholder_i18n: 'descripcion',
            requerido: true,
            tipo: 'text',
        },
    ],
};
