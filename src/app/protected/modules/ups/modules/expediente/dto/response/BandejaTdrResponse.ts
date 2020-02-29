export interface BandejaTdrResponse{
    item: number;
	idCodigo: number;
	codDocumento: string;
	fidUnidadOrigen: number;
    fecReg: string;
    fidProyecto: number;
}

export interface WsResponseBandejaTdr {
    response: BandejaTdrResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
}

