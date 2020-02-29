export class Programacion{

    item: number;
    cidCodigoMes: string;
    mes: string;
    metrado: string;
    precio: string;
    porcentaje: string;
    fidPartida: number;

}

export interface WsResponseProgramacion {
    response: Programacion[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }