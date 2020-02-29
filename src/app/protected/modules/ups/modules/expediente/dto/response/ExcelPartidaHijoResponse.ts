export class ExcelPartidaHijoResponse{

    id: number;
    idCodigo?: string;
    codigoPartida?: string;
    nombrePartida?: string;
    rendimiento?: string;
    manoObra?: string;
    equipo?: string;
    costoUnitario?: string;
    subTotalPartida?: string;
    detallePrecioUnitario?: string;
    cantidadHijo?: number;
    //cantidadHijo?: number;
}


export interface WsResponseExcelPartidaHijoResponse {
    response: ExcelPartidaHijoResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
}