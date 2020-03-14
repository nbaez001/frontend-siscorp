export interface ActividadResponse{
    idCodigo: number;
    nombre: string;

}


export interface WsResponseActividad {
    response: ActividadResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }