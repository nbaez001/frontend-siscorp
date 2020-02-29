


// MENSAJES DE EXCEPCIONES
export const MENSAJES = {

    PREOPERATIVA: {

        TITLE_PROYECTO: 'DATOS GENERALES DEL PROYECTO',
        TITLE_CRP: 'FILTROS PERFIL PREFACTIBILIDAD',
    },

    PREFACTIBILIDAD: {

        TITLE: 'PERFIL PREFACTIBILIDAD',
        TITLE_FILTROS: 'FILTROS PERFIL PREFACTIBILIDAD',
        OK_PREFACTIBILIDAD: 'El estado del perfil de prefactibilidad fue modificado.',
        ERROR_SIN_DATA: 'No se encontraron resultado',
        ERROR_CARGA_ARCHIVO: 'Ocurrio un error al cargar el archivo',
        ERROR_ENVIAR_CORREO: 'Ocurrio un error al enviar correo a lider tumor',
        EXITO_ENVIAR_CORREO: 'Se envio un correo de manera exitosa',
        WARNING_FILTROS: 'Debe ingresar algún filtro de búsqueda',
        TITLE_OBSERVACIONES: 'Registrar Observaciones',
        INFO_SUCCESS_OBSERVACIONES: 'La observación se registro Correctamente',
        WARNING_OBSERVACIONES: 'Debe ingresar una observación',
        WARNING_AUSENCIA: 'Esta seguro de registrar su ausencia ? \n Los expedientes en estado PENDIENTE DE ASIGNACIÓN serán enviados al cordinador',
        WARNING_RETORNO: 'Esta seguro de activar su retorno ? \n Los expedientes en estado PENDIENTE DE ASIGNACIÓN serán retornados a su bandeja',
        WARNING_CAMPOS_OBLIGATORIOS: 'Todos los campos son obligatorios',
        OBSERVACION_REQUERIDA: 'Debe registrar al menos 1 observación',
        TITLE_ALCANCE_DESCRIPCION_SERVICIO: 'Registrar Alcance',
        WARNING_ALCANCE_DESCRIPCION_SERVICIO: 'Debe ingresar el alcance del servicio',

    },

    TDR: {
        TITLE_TDR: 'REGISTRAR TDR',
        TITLE_ALCANCE: 'Alcance y Descripción del Servicio',
        TITLE_ENTREGABLE: 'Entregable',
        TITLE_ACTIVIDAD: 'Actividad',
        TITLE_ACTIVIDAD_MODIFICACION: 'Actividad',
        TITLE_CONDICION_GENERAL: 'Condición General',
        TITLE_CONDICION_PARTICULAR: 'Condición Particular',
        INFO_SUCCESS_ALCANCE: 'Registro Correcto!',
        INFO_SUCCESS_ENTREGABLE: 'Registro Correcto!',
        INFO_SUCCESS_TAB_1: 'Continue Ingresando los Objetivos y Alcances!',
        WARNING_ACTIVIDAD: 'Debe ingresar la actividad',
        INFO_SUCCESS_ACTIVIDAD: 'Registro Correcto!',
        WARNING_CONDICION_GENERAL: 'Debe ingresar la condición general',
        WARNING_CONDICION_PARTICULAR: 'Debe ingresar la condición particular',
        WARNING_CONDICION_PARTICULAR_PERFIL: 'Debe seleccionar un tipo de perfil de contratación',
        WARNING_DESCRIPCION_GENERAL_ENTREGABLE: 'Debe ingresar una descripción general de los entregables',
        INFO_SUCCESS_DESCRIPCION_GENERAL_ENTREGABLE: 'Registro Descripción Realizado!',
        INFO_SUCCESS_CONDICION_GENERAL: 'Registro Correcto!',
        INFO_SUCCESS_CONDICION_GENERAL_MODIFICADO: 'Modificación Correcta!',
        INFO_SUCCESS_CONDICION_PARTICULAR: 'Registro Correcto!',
        INFO_SUCCESS_ALCANCE_MODIFICACION: 'Modificación Correcta!',
        INFO_SUCCESS_ENTREGABLE_MODIFICACION: 'Modificación Correcta!',
        INFO_SUCCESS_ACTIVIDAD_ACTUALIZACION: 'Modicicación Correcta!',
        TITLE_ALCANCE_DESCRIPCION_SERVICIO: 'Registrar Alcance',
        WARNING_ENTREGABLE_NOMBRE: 'Debe ingresar el nombre del entregable',
        WARNING_ENTREGABLE_PLAZO: 'Debe ingresar el plazo deL entregable',
        WARNING_CAMPO_OBLIGATORIO_CODIGO_FORMATO: 'Debe seleccionar un código de formato',
        WARNING_CAMPO_OBLIGATORIO_UNIDAD_ELABORADOR: 'Debe seleccionar un unidad de elaboración',
        WARNING_CAMPO_OBLIGATORIO_DENOMICACION: 'Debe ingresar la denominación de contratación',
        WARNING_CAMPO_OBLIGATORIO_FINALIDAD: 'Debe ingresar la finalidad pública',
        WARNING_CAMPO_OBLIGATORIO_ANTECENDENTE: 'Debe ingresar el antecedente',
        INFO_SUCCESS_TDR: 'TDR creado de manera correcta!',
        TITLE_FORMATO_CODIGO: 'Formato Código - '

    },


    EXPEDIENTE_ASIGNAR: {
        TITLE: 'ASIGNAR EXPEDIENTE TÉCNICO',
        ENCARGADO_REQUERIDO: 'DEBE SELECCIONAR A UN PERSONAL PARA ASIGNAR',
        INFO_SUCCESS: 'ASIGNACIÓN REALIZADA',
        INFO_MODALIDAD: 'LA MODALIDAD DE EJECUCIÓN ES : ',
        INFO_USUARIO: 'EL ENCARGADO ASIGNADO ES: '
    },

    PREFACTIBILIDAD_ENCARGADO: {
        TITLE_PRINCIPAL: 'ENVIAR EXPEDIENTE TÉCNICO',
        TITLE: 'DAR CONFORMIDAD',
        TITLE_OBSERVACION: 'OBSERVAR EXPEDIENTE',
        INFO_SUCCESS: 'CONFORMIDAD REALIZADA CORRECTAMENTE',
        INFO_SUCCESS_OBSERVACION: 'OBSERVACION REALIZADA CORRECTAMENTE',
        INFO_SUCCESS_EQUIPO_ELABORADOR: 'EQUIPO DE PROFESIONALES REGISTRADOS CORRECTAMENTE',
        ERROR_REGISTRAR_EQUIPO_ELABORADOR: 'ERROR AL REALIZAR EL REGISTRO DEL EQUIPO ELABORADOR',
        TITLE_PROFESIONALES: 'ELABORACIÓN  EXPEDIENTE TÉCNICO',
        ENVIAR_PARA_APROBACION: '¿Está seguro de enviar el expediente al coordinador para su aprobación?',

        WARNING_ARQUITECTO: 'Debe seleccionar un arquitecto',
        WARNING_CIVIL: 'Debe seleccionar un ingeniero civil',
        WARNING_ELECTRICO: 'Debe seleccionar un ingeniero eléctrico',
        WARNING_SANITARIO: 'Debe seleccionar un ingeniero sanitario',

    },

    PREFACTIBILIDAD_COORDINADOR: {
        TITLE: 'DAR CONFORMIDAD',
        INFO_SUCCESS: 'CONFORMIDAD REALIZADA',
        DERIVAR_ENCARGADO_CONFIRM: '¿Está seguro de derivar al encargado el código: ',
        APROBAR_EXPEDIENTE: '¿Está seguro de aprobar el expediente?',
        ENVIAR_PARA_APROBACION: '¿Está seguro de aprobar el expediente?',
    },

    TRABAJADOR: {
        ELIMINAR_TRABAJADOR_CONFIRM: '¿Está seguro de eliminar al trabajador: ',
        TITLE_TRABAJADOR: 'TRABAJADOR',
        TITLE_BANDEJA_TRABAJADOR: 'BANDEJA TRABAJADOR',
        GUARDAR_TRABAJADOR_CONFIRM: '¿Está seguro de guardar los datos del trabajador?',
        GUARDAR_TRABAJADOR_FALTAN_DATOS: 'Ingrese todos los campos obligatorios',
        MODIFICAR_TRABAJADOR_CONFIRM: '¿Está seguro de modificar los datos del trabajador?',
        MODIFICAR_JORNAL: '¿Está seguro de de enviar la propuesta?',
        SOLICITAR_ACTIVACION: '¿Está seguro de de enviar la solicitud?',
        MODIFICAR_JORNAL_FALTAN_CAMPOS: 'Ingrese todos los campos',
        GUARDAR_TRABAJADOR_ASISTENCIA: '¿Está seguro de registrar la asistencia de los trabajadores?',
        LLENAR_CAMPOS_OBLIGATORIOS: 'Debe llenar todos los campos obligatorios',
    },

    EXCEL: 'EXPORTAR A EXCEL',
    EXCEL_NO_DATA_FOUND: 'NO EXISTEN DATOS QUE EXPORTAR !',
    ERROR_EXPORTAR_EXCEL: 'Error en Servicio de Exportar Excel',
    WARNIG_USER_PASSWOR_LOGIN: 'El usuario o contraseña son incorrectos',
    ERROR_LOGIN: 'Error de autentificación del usuario',
    ERROR_CARGA_SERVICIO: 'Error en el Servidor.',
    ERROR_CAPTCHA: 'Error al obtener captcha',
    ERROR_FORGOTPASSWORD: 'Error al enviar solicitud de nueva contraseña',
    ERROR_DOCREQUERIDO: 'Error - No hay documentos requeridos',
    ERROR_CAMPOS: 'Validar los campos requeridos',
    ERROR_VALIDA_DOC: 'Validar documentos requeridos',
    ERROR_SERVICIO: 'Error al obtener los datos del Servidor.',
    ERROR_NOFUNCION: 'Ocurrio un error',
    INFO_FORGOTPASSWORD: 'Se envio un enlace a tu correo...',
    INFO_SUCCESS: 'Consulta Exitosa.',
    INFO_SALIR: '¿Desea salir?',
    INFO_SALIR2: 'Se perderan los cambios.',
    INFO_ATRAS: '¿Desea ir atras?  Se perderan los cambios...',
    INFO_ACEPTAR: 'Se registro Correctamente',
    INFO_FECHA_INICIO: 'Por favor, ingresar la fecha de inicio antes de grabar',
    INFO_FECHA_FIN: 'Por favor, ingresar la fecha fin antes de grabar',
    INFO_NO_DATA: 'No se encontraron resultados',
    DERIVAR_COORDINADOR_CONFIRM: '¿Está seguro de derivar al coordinador el código: ',
    WARNING_ASIGNAR_ENCARGADO: 'Sólo puede asignar un encargado',
    ERROR_SERVICIO_ASIGNAR_ENCARGADO: 'Ocurrio un error no se pudo realizar la asignacion',
    ERROR_SERVICIO_CONFORMIDAD: 'Ocurrio un error no se pudo realizar la conformidad',
    ERROR_SERVICIO_OBSERVACION: 'Ocurrio un error no se pudo cambiar el expediente a OBSERVADO',
    ARCHIVO_INFO_SUCCESS: 'Archivo se adjunto correctamente',
    ARCHIVO_ERROR_CARGA: 'Error al adjuntar el archivo',
    ARCHIVO_TITLE: 'ADJUNTAR ARCHIVO',
    ARCHIVO_TIPO_DOC_REQUERIDO: 'Debe seleccionar un tipo de documento',
    ENVIAR_DE_ENCARGADO_A_COORDINADOR_CONFIRM: '¿Está seguro de enviar el expediente técnico al coordinador?',
    ARCHIVO_PROCESO_PENDIENTE_ELIMINADO: 'El archivo no se puede eliminar, porque se encuenta en proceso pendiente',
    ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_PRESUPUESTO: 'PRESUPUESTO',
    ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_PARTIDA: 'PARTIDA',
    ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_GENERAL: 'DESAGREGADO DE GASTOS GENERALES',
    ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_SUPERVISION: 'DESAGREGADO DE GASTOS SUPERVISIÓN',
    ARCHIVO_CONFIRMAR_CONFORMIDAD_EXCEL: 'Esta seguro de dar conformidad?',
    ARCHIVO_CONFORMIDAD_INFO_SUCCESS: 'La conformidad ha sido realizada',

    PROYECTO: {
        TITLE_BANDEJA_PROYECTO: 'BANDEJA PROYECTOS',

    },
    CRONOGRAMA: {
        TITLE_CRONOGRAMA_EJECUCION: 'CRONOGRAMAS',
        TITLE_CRONOGRAMA_INSUMO: 'CRONOGRAMA DE INSUMO',
        TITLE_INSUMO: 'PARTIDA',
        INFO_SUCCESS: 'ELIMINACIÓN REALIZADA',
        ELIMINAR_INSUMO_CONFIRM: '¿Está seguro de eliminar el insumo: ',
        ELIMINAR_PROGRAMACION_CONFIRM: '¿Está seguro de eliminar la programación del mes ',
        GRABAR_PARTIDA: '¿Está seguro de generar la partida?',
        VALIDAR_INSUMO: 'Debe ingresar al menos un insumo',
        VALIDAR_PROGRAMACION: 'Debe ingresar al menos una programación mensual',
        VALIDAR_PARTIDA: 'Debe seleccionar una partida',
        VALIDAR_SUSTENTO: 'Debe ingresar un sustento'
    },
    AUTORIZACION: {
        TITLE_AUTORIZACION: 'AUTORIZACIÓN DE GASTO',
        INFO_SUCCESS: 'ELIMINACIÓN REALIZADA',
        ELIMINAR_AUTORIZACION_CONFIRM: '¿Está seguro de eliminar la autorización : ',
        ELIMINAR_PROGRAMACION_CONFIRM: '¿Está seguro de eliminar la programación del mes ',
        GRABAR_PARTIDA: '¿Está seguro de generar la partida?',
        VALIDAR_INSUMO: 'Debe ingresar al menos un insumo',
        VALIDAR_PROGRAMACION: 'Debe ingresar al menos una programación mensual',
        VALIDAR_PARTIDA: 'Debe seleccionar una partida',
        VALIDAR_SUSTENTO: 'Debe ingresar un sustento'
    },
    COTIZACION: {
        TITLE_AUTORIZACION: 'AUTORIZACION',
        INFO_SUCCESS_ELIMINACION: 'ELIMINACIÓN REALIZADA',
        ELIMINAR_COTIZACION_CONFIRM: '¿Está seguro de eliminar?',
        ELIMINAR_PROGRAMACION_CONFIRM: '¿Está seguro de eliminar la programación del mes ',
        GUARDAR_COTIZACION: '¿Está seguro de guardar la cotización?',
        AUTORIZACION_GASTO: '¿Está seguro de generar autorización de gasto?',
        GUARDAR_CUADRO_COMPARATIVO: '¿Está seguro de guardar el cuadro comparativo?',
        INFO_SUCCESS_GUARDAR: 'La cotización fue guardada de forma correcta',
        INFO_SUCCESS_FINALIZAR: 'La cotización fue finalizada de forma correcta',
        INFO_SUCCESS_GUARDAR_CUADRO_COMPARATIVO: 'El cuadro comparativo fue guardado de forma correcta',
        VALIDAR_INSUMO: 'Debe ingresar al menos un insumo',
        VALIDAR_PROGRAMACION: 'Debe ingresar al menos una programación mensual',
        VALIDAR_PARTIDA: 'Debe seleccionar una partida',
        VALIDAR_SUSTENTO: 'Debe ingresar un sustento'
    },
    CARTAFIANZA: {
        TITLE_CARTA: 'CARTA FIAZNA',
        INFO_SUCCESS_ELIMINACION: 'ELIMINACIÓN REALIZADA',
        ELIMINAR_COTIZACION_CONFIRM: '¿Está seguro de eliminar la cotización : ',
        ELIMINAR_PROGRAMACION_CONFIRM: '¿Está seguro de eliminar la programación del mes ',
        EJECUTAR_CARTA: '¿Está seguro de ejecutar la carta fianza?',
        RENOVAR_CARTA: '¿Está seguro de renovar la carta fianza?',
        INFO_SUCCESS_CARTA_EJECUTAR: 'La carta fianza fue ejecutada de forma correcta',
        INFO_SUCCESS_CARTA_RENOVAR: 'La carta fianza fue renovada de forma correcta',
        VALIDAR_INSUMO: 'Debe ingresar al menos un insumo',
        VALIDAR_PROGRAMACION: 'Debe ingresar al menos una programación mensual',
        VALIDAR_PARTIDA: 'Debe seleccionar una partida',
        VALIDAR_SUSTENTO: 'Debe ingresar un sustento'
    },
    INSUMO: {
        GUARDAR_INSUMO: '¿Está seguro de registrar el insumo?',
        MODIFICAR_INSUMO: '¿Está seguro de modificar el insumo?'
    },
    REQUERIMIENTO: {
        TITLE_REQUERIMIENTO: 'BANDEJA AUTORIZACIÓN DE GASTO',
        INFO_SUCCESS_ELIMINACION: 'ELIMINACIÓN REALIZADA',
        ELIMINAR_COTIZACION_CONFIRM: '¿Está seguro de eliminar la cotización : ',
        ELIMINAR_PROGRAMACION_CONFIRM: '¿Está seguro de eliminar la programación del mes ',
        GUARDAR_REQUERIMIENTO: '¿Está seguro de generar el autorización de gasto? COSTO DIRECTO = 2 ,  GASTOS GENERALES = 1, GASTO DE RESIDENTE = 1, GASTOS FINANCIEROS = 0 , GASTOS DEL NUCLE EJECUTOR = 0, GASTOS DE SUPERVISIÓN = 0',
        INFO_SUCCESS_GUARDAR: 'generación del autorización de gasto realizada',
        VALIDAR_INSUMO: 'Debe ingresar al menos un insumo',
        VALIDAR_PROGRAMACION: 'Debe ingresar al menos una programación mensual',
        VALIDAR_PARTIDA: 'Debe seleccionar una partida',
        VALIDAR_SUSTENTO: 'Debe ingresar un sustento',
        DERIVAR_REQUERIMIENTO_CONFIRM: '¿Está seguro de derivar el requerimiento : ',
        INFO_SUCCESS_ENVIAR: 'El requeremiento fue enviado al supervisor',
    },
    PROVEEDOR: {
        GUARDAR_PROVEEDOR: '¿Está seguro de registrar al proveedor?',
        MODIFICAR_PROVEEDOR: '¿Está seguro de modificar datos del proveedor?'
    }
    /**WHR INICIO**/

    , PRE_LIQUIDACION: {
        TITULO_BANDEJA_COMPROBANTE: 'COMPROBANTES MULTIPLES',
        TITULO_BANDEJA_INFORME_PL: 'INFORME PRE LIQUIDACION',
        TITULO_BANDEJA_VAL_AVAN_OBRA: 'VALORIZACIÓN DE AVANCE DE OBRA',
        TITULO_BANDEJA_MOV_ALM_ES: 'RESUMEN MOVIMIENTO DE ALMACEN ENTRADA-SALIDA'
    }

    /**WHR FIN**/

};

export const TIPO_USUARIO = {
    JEFE_UPS: 'JEFE_UPS',
    COORDINADOR_UPS: 'COORDINADOR_UPS',
    ENCARGADO_EXPEDIENTE: 'ENCARGADO_EXPEDIENTES_UPS'
}

export const MODULOS_SISCORP = {
    UA: {
        NOMBRE: 'UNIDAD DE ADMINISTRACION',
        MODULOS: {
            CONTROL_COMBUSTIBLE: { id: 10, nombre: 'CONTROL DE COMBUSTIBLE' },
            CONTROL_PATRIMONIO: { id: 11, nombre: 'CONTROL DE PATRIMONIAL' }
        }
    }
}