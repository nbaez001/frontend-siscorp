export class ExcelGastoGeneralHijoResponse{

    id: number;
    numero?: string;
    descripcion?: string;
    unidad?: string;
    cantidadUnidad?: string;
    costoUnitario?: string;
    coefPart?: string;
    parcial?: string;
    subTotal?: string;
    total?: string;
    idPadre?: number;
    cantidadHijo?: number;

}

export interface WsResponseExcelGastoGeneralHijoResponse {
    response: ExcelGastoGeneralHijoResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
}

