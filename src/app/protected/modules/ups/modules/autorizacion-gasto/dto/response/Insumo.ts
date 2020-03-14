export class Insumo{


    item: number;
    cidCodigo: string;
    tipoInsumo: string;
    cidCodigoPart: string;
    codigoPart: string;
    descripcion: string;
    unidad: string;
    cuadrilla: string;
    cantidad: string;
    precio: string;
    parcial: string;
    fidPartida: number;

}


export interface WsResponseInsumo {
    response: Insumo[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  