export let FORM_INFO_RUBRO = {

    tipo_formulario: 'mini',
    alertas: true,
    modelo: 'RubroHijo',
    campos: [
        // {
        //     etiqueta: 'input',
        //     claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
        //     nombre: 'RubroPadre',
        //     label_i18n: 'Rubro Padre',
        //     placeholder_i18n: 'Rubro Padre',
        //     requerido: false,
        //     deshabilitar: true,
        //     tipo: 'text',
        // },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
            nombre: 'Codigo',
            label_i18n: 'Código',
            placeholder_i18n: 'Código',
            requerido: true,
            pattern: '^[1-9]{1,9}',
            tipo: 'number',
            prefix: {
                value: '',
            },
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
            nombre: 'Nombre',
            label_i18n: 'Nombre',
            placeholder_i18n: 'Nombre del Rubro',
            requerido: true,
            tipo: 'text',
        },
        // {
        //     etiqueta: 'select',
        //     claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
        //     nombre: 'UnidadEjecutora',
        //     label_i18n: 'Unidad Ejecutora',
        //     placeholder_i18n: 'Unidad Ejecutora',
        //     requerido: true,
        //     tipo: 'UnidadEjecutora',
        //     key: 'Valor',
        //     opciones: [
        //         {Valor: 1},
        //         {Valor: 2},
        //         {Valor: 3}
        //     ],
        // },
        // {
        //     etiqueta: 'select',
        //     claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
        //     nombre: 'Organizacion',
        //     label_i18n: 'Organizacion',
        //     placeholder_i18n: 'Organizacion',
        //     requerido: true,
        //     tipo: 'Organizacion',
        //     key: 'Valor',
        //     opciones: [
        //         {Valor: 1},
        //         {Valor: 2},
        //         {Valor: 3}
        //     ],
        // },
        {
            etiqueta: 'textarea',
            claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
            nombre: 'Descripcion',
            label_i18n: 'Descripcion',
            placeholder_i18n: 'Descripcion',
            requerido: false,
            tipo: 'text',
        },
    ],
};
