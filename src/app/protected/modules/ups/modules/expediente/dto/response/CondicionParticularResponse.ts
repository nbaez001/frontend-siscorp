export interface CondicionParticularResponse{
    
    idCodigoCondicionParticular: number;
	fidTdr: number;
	descripcionCondicionParticular: string;
	idCodigoPerfil: number;
	nombrePerfil: string;
}

export interface WsResponseCondicionParticular {
    response: CondicionParticularResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }