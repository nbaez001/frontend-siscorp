export class DetalleTdr{

    idCodigoTdr: number;
	idCodigoFormato: number;
	codigoFormato: string;
    fidUnidadElaborador: number;
	unidadElaborador: string;

	fidUnidadRevisor: number;
	unidadRevisor: string;

	fidUnidadAProbado: number;
	unidadAProbado: string;

	fidUnidadOrigen: number;
	unidadOrigen: string;

	denominacion: string;
	finalidadPublica: string;

	idCodigoAntecedente: number;
	nombreAntecedente: string;
	contenidoAntecedente: string;

	 objetivo: string;
	 lugar: string;
	 plazoEjecucion: string;
	 conformidadPrestacion: string;
	 confidencialidad: string;
	 penalidad: string;
	 propiedadIntelectual: string;

	 CodigoAnticorrupcion: number;
	 nombreAnticorrupcion: string;
	 contenidoAnticorrupcion: string;
	 responsabilidadVicioOculto: string;
	 otraCondicion: string;

	 version: string;
	 contenidoEntregable: string; 
	 personaTipo: number;
}


export interface WsResponseTdrEditar {
    response: DetalleTdr[];
    total: number;
    codResultado: number;
    msgResultado: string;
}
