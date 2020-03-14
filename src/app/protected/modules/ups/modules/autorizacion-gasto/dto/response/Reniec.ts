interface detalleReniec {
    apellidoCasada: string;
    apellidoMaterno: string;
    apellidoPaterno: string;
    direccionDomicilio: string;
    distDomicilio: string;
    dptoDomicilio: string;
    fechaNacimiento: string;
    nombres: string;
    numeroDocumento: string;
    provDomicilio: string;
    sexo: string;
    ubigeoDistDomicilio: string;
    ubigeoDptoDomicilio: string;
    ubigeoProvDomicilio: string;
}

export interface Reniec {
    retorno?: string;
    mensaje?: string;
    reniec?: detalleReniec
}