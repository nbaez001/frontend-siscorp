export interface PersonalResponse {
    idCodigo: number;
    cidCodigo: string;
    cidNombre: string;

  }

  export interface WsResponsePersonal {
    response: PersonalResponse[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }