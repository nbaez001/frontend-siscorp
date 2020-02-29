export class CotizacionProveedorRequest {
    idCodigo: number;
    nombreRazonSocial: string;
    numeroDocumento: string;
    fechaCotizacion?: string;
    vigenciaCotizacion?: string;
    plazoEntrega?: string;
    formaPago?: number;
    sustento?: string;

    idCodigoArchivo?: string;
    nombreArchivo?: string;

    estado?: string;
    condicion?: string;


}
