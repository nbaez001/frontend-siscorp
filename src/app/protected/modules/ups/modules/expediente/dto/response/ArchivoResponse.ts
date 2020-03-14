export interface ArchivoResponse{

    idCodigoArchivo: number;
    nombreArchivo: string;
    fechaRegistro: string;
    tipoArchivo: string;
    descripcion: string;
    nombreEstdo: string;
    cidNombreEstado: string;
    cidTipoArchivo: string;

}


export interface WsResponseArchivo {
    response: ArchivoResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }