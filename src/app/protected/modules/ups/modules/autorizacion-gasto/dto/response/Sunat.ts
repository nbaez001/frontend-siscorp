interface detalleSunat {
    codigoCiiu?: string;
    codigoCondicionDomicilio?: string;
    codigoDepartemento?: string;
    codigoDependencia?: string;
    codigoDistrito?: string;
    codigoEstado?: string;
    codigoProvincia?: string;
    codigoSecuencia?: string;
    codigoTipoContribuyente?: string;
    codigoTipoPersona?: string;
    codigoTipoVia?: string;
    codigoTipoZona?: string;
    codigoUbigeo?: string;
    condicionDomicilio?: string;
    departamento?: string;
    dependencia?: string;
    descripcionCiiu?: string;
    distrito?: string;
    esActivo?: true;
    esHabido?: true;
    estado?: string;
    fechaActualizacion?: string;
    fechaAlta?: string;
    fechaBaja?: string;
    interior?: string;
    libretaTributaria?: string;
    nombreVia?: string;
    nombreZona?: string;
    numero?: string;
    numeroRUC?: string;
    provincia?: string;
    razonSocial?: string;
    referenciaUbicacion?: string;
    tipoContribuyente?: string;
    tipoPersona?: string;
    tipoVia?: string;
    tipoZona?: string
}

export interface Sunat {
    retorno?: string;
    mensaje?: string;
    sunat?: detalleSunat
}
