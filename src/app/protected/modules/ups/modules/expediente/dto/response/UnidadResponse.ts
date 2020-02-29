export interface UnidadResponse {
    idCodigo: number;
    cidCodigo: string;
    cidNombre: string;

  }

  export interface WsResponseUnidad {
    response: UnidadResponse[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }