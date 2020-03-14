  export class ItemBean {
    idCodigo: number;
    cidCodigo?: string;
    cidNombre: string;
    estados?: string;
    alertas?:string;
    nombrePerfil?: string;
  }
 

  export interface WsResponseItem {
    response: ItemBean[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }