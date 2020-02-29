export interface FormatoCodigoResponse {
    idCodigo: number;
    cidCodigo: string;
    cidNombre: string;

  }

  export interface WsResponseFormatoCodigo {
    response: FormatoCodigoResponse[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }