export class Autorizacion{

    item: string;
    idCodigo: number;
    codigo: string;
    fecPresentacion: string;
    fecAprobacion: string;
    montoSolicitado: string;
    montoAutorizado: string;
    saldoDisponible: string;
    estado: string;
    cidEstado: string;
    numPlazo: number;
    color: string;
    fidProyecto: number;

}


export interface WsResponseAutorizacion {
    response: Autorizacion[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }