export class ValorizacionAvance{

    id: string;
    partida: string;
    descripcion: string;
    undPre: string;
    metPre: string;
    precioUnitPre: string;
    presupuesto: string;
    metAnt: string;
    valAnt: string;
    metAct: string;
    valAct: string;
    metAcu: number;
    valAcu: string;
    porcentajeAcu: string;
    metSaldo: string;
    valSaldo: string;
    porcentajeSaldo: string;

}


export interface WsResponseValorizacionAvance {
    response: ValorizacionAvance[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  