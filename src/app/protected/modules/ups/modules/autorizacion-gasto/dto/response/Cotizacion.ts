export class Cotizacion{

    item: string;
    idCodigo: number;
    codigo: string;
    fechaCreacion: string;
    rubro: string;
    proveedor: string;
    nroRuc: string;
    estado: string;
    cidEstado: string;
    fidProyecto: number;
    cantidadProgramacion: string;
    cantidadCotizacion: string;
    cantidadSolicitada: string;
    cantidadDisponible: string;
    precioCalculado: string;
    numeroAutorizacionGasto?:string;


}


export interface WsResponseCotizacion {
    response: Cotizacion[];
    total: number;
    codResultado: number;
    msgResultado: string;
    cantidadMeses?: number;
  }