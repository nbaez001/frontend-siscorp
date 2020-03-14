export class ExcelPartidaHijoCategoriaResponse{
    idCategoria?: number;
    nombrecategoria?: string;
    idPartida?: number;
    cantidadHijo?: number;

}


export interface WsResponseExcelPartidaHijoCategoriaResponse {
    response: ExcelPartidaHijoCategoriaResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
}