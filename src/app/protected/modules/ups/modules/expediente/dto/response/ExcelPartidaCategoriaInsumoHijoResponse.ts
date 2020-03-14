export class ExcelPartidaCategoriaInsumoHijoResponse{

    idCodigo?: number;
    codigoPartida?: string;
    descripcionInsumo?: string;
    categoriaInsumo?: string;
    unidad?: string;
    cuadrilla?: string;
    cantidad?: string;
    precio?: string;
    parcial?: string;
    cantidadHijo?: number;

}


export interface WsResponseExcelPartidaCategoriaInsumoHijoResponse {
    response: ExcelPartidaCategoriaInsumoHijoResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
}