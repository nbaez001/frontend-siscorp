export interface CondicionGeneralResponse{
    idCodigoDetalle: number;
	fidTdr: number;
	idCodigoCondicionGeneral: number;
    nombreCondicionGeneral: string;
   
}

export interface WsResponseCondicionGeneral {
    response: CondicionGeneralResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }