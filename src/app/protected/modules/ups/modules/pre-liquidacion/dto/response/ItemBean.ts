  export class ItemBean {
    idCodigo: number;
    cidCodigo?: string;
    cidNombre: string;
    estados?: string;
    rubros?:string;
    tipos?:string;

    mesesDeclarar?: string;
    tipoComprobantes?: string;
    departamentos?: string;
    provincias?: string;
    distritos?: string;
    localidades?: string;
    cargosNE?: string;
    referencias?: string;
    gastos?: string;
    tipodocs?: string; 
  }
 


  export interface WsItemBeanResponse {
    response: ItemBean[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }