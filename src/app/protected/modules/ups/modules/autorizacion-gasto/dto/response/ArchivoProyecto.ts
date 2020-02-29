export class ArchivoProyecto{
º
    idCodigoArchivo: number;
    nombreArchivo: string;
    fechaRegistro: string;
    tipoArchivo: string;
    descripcion: string;
    cidTipoArchivo: string;
    fidProyecto: number;
}


export interface WsResponseArchivoProyecto {
    response: ArchivoProyecto[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }