export class ExcelPresupuestoHijoResponse{

    id: number;
    codigoItem?: string;
    descripcion?: string;
    unidad?: string;
    metrado?: string;
    precio?: string;
    parcial?: string;
    color?: string;
    idPadre?: number;
    nivel?: string;
    cantidadHijo?: number;

}

export interface WsResponseExcelPresupuestoHijoResponse {
    response: ExcelPresupuestoHijoResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
}


