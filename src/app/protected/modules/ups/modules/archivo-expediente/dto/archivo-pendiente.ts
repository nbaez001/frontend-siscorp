export interface WsResponse {
    response: any[];
    total: number;
    codResultado: number;
    msgResultado: string;
}

export interface WsApiOutResponse {
    codResultado: number;
    msgResultado: string;
    total: number;
    response: any;
    status: string;
    message: any;
    messageAux: any;
}

export class ArchivoRequest {
    usrApp?: string;
    nomArchivo?: string;
    archivo?: File;
    ruta?: string;
    idProyecto?: number;
    descripcion?: string;
    tipoDoc?: number;
    fidProyecto?: number;
    idTipoModalidad?: number;
}

export const ARCHIVOS_EXCEL = {

    PRESUPUESTO: '007',
    PARTIDA: '008',
    GASTOS_GENERALES: '009',
    GASTOS_SUPERVISION: '010',
    RD_EXPEDIENTE_TECNICO: '013',
}
