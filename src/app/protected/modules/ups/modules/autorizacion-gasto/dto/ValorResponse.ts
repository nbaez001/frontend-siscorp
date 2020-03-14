export class ValorResponse{

	valorNumerico: number;
	valorCadena: string;

}

export interface WsResponseValor {
    response: ValorResponse;
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  