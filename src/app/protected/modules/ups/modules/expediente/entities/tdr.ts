export class Tdr{
    // tab 1
	fidFormato: number; 
    fidUnidadElabora: number;
    fidUnidadRevisa: number;
    fidUnidadAPrueba: number;
    fidUnidadOrganica: number;
    denominacion: string;
    finalidadPublica: string;
    antecedente: string;
    personaTipo: number;
    fidProyecto: number;
    

	// tab 2
    objetivo?: string;
    lugarPrestacion?: string;
    plazoEjecucion?: string;
    alcance?: string;
    fidTdr?: number;
	// tab 3
    nombreEntregable?: string;
    plazoEntregable?: string;
    descripcionEntregable?: string;
    contenidoEntregable?: string;
	// tab 4
    fidCondicionGeneral?: number;
    descripcionCondicionGeneral: string;
    fidPerfilContratacion?: number;
    descripcionCondicionParticular?: string;
    fidEntregable?: number;
    fidModalidad?: number;
    descripcionFormaPago?: String;
	// tab 5
	conformidadPrestacion: string;
	confidencialidad: string;
	penalidad: string;
	propiedadIntelectual: string;
	responsabilidadVicioOculto: string;
    otrasCondiciones: string;
    contenidoAnticorrupcion: string;
	fidAnticorrupcion: number;
	// bandeja
	codDocumento: string;
	fechaInicio: string;
	fechaFin: string;
}

export interface WsResponseTdr {
    response: Tdr[];
    total: number;
    codResultado: number;
    msgResultado: string;
}


 

