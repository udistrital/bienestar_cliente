
export let FORM_PRODUCTO = {
    titulo: 'Producto',
    tipo_formulario: 'mini',
    btn: 'Guardar',
    alertas: true,
    modelo: 'Producto',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'col-6',
            nombre: 'Codigo',
            label_i18n: 'codigo',
            placeholder_i18n: 'codigo',
            requerido: true,
            tipo: 'number',
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-6',
            nombre: 'Nombre',
            label_i18n: 'nombre',
            placeholder_i18n: 'nombre',
            requerido: true,
            tipo: 'text',
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-6',
            nombre: 'Descripcion',
            label_i18n: 'descripcion',
            placeholder_i18n: 'descripcion',
            requerido: true,
            tipo: 'text',
        }
    ],
};
