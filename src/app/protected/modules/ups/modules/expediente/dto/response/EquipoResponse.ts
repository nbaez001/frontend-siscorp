export interface EquipoResponse {
    idCodigo?: number;
    tipo?: string;
    profesion?: string;
    colaborador?: string;

  }


  export interface WsResponseEquipo {
    response: EquipoResponse[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }