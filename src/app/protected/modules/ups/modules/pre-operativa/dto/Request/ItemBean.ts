export class ItemBean {
    idCodigo: number;
    cidCodigo?: string;
    cidNombre: string;
    estados?: string;
    alertas?:string;
    proveedores?:string;
    nombrePerfil?: string;
    crpS?: string;
    cgpS?: string;
    opcion?:string;


  }
 

  export interface WsItemBeanResponse {
    response: ItemBean[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }