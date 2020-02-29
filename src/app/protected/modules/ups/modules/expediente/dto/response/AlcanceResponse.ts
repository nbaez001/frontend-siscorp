export class AlcanceResponse{
    idCodigo: number;
    nombre: string;
    fidTdr: number;

}


export interface WsResponseAlcance {
    response: AlcanceResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }