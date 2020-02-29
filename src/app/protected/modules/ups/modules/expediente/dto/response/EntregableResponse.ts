export class EntregableResponse{
    idCodigo: number;
    nombre: string;
    plazo: string;
    descripcion: string;
    formaPago: string;
    fidModalidad: number;

}


export interface WsResponseEntregable {
    response: EntregableResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }