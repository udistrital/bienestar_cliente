export let FORM_VALUE_FUENTE = {

    tipo_formulario: 'currency',
    titulo: 'Valor Fuente Financiamiento',
    btn: 'Guardar',
    alertas: true,
    modelo: 'FuenteFinanciamiento',
    campos: [
        {
             etiqueta: 'input',
             claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
             nombre: 'ValorInicial',
             label_i18n: 'Valor',
             placeholder_i18n: 'valor',
             requerido: true,
             tipo: 'text',
             enabledcurrency: true,
             prefix: {
                 value: '',
             },
         },
         {
            etiqueta: 'select',
            claseGrid: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'Vigencia',
            label_i18n: 'Vigencia',
            placeholder_i18n: 'vigencia',
            requerido: true,
            tipo: 'Vigencia',
            key: 'vigencia',
            opciones: [
            ],
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'NumeroDocumento',
            label_i18n: 'Número de Documento',
            placeholder_i18n: 'Número de Documento',
            requerido: true,
            pattern: '^[A-Za-z0-9_]{1,10}$',
            tipo: 'text',
            enabledcurrency: false,
            prefix: {
                value: '',
            },
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'TipoDocumento',
            label_i18n: 'Tipo de Documento',
            placeholder_i18n: 'tipo_documento',
            requerido: true,
            tipo: 'TipoDocumento',
            key: 'Nombre',
            opciones: [
                { Id:1, Nombre: 'ACTA' },
                { Id:2, Nombre: 'RESOLUCION' },
                { Id:3, Nombre: 'CONTRATO' },
            ],
        },
        {
            etiqueta: 'mat-date',
            claseGrid: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
            nombre: 'FechaCreacion',
            label_i18n: 'Fecha Documento',
            placeholder_i18n: 'Fecha Documento',
            requerido: true,
        }                 
    ],
};
