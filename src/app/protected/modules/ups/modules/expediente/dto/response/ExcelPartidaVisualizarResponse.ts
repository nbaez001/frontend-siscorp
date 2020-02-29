  export class ExcelPartidaVisualizarResponse{
    precioUnitarioCabecera: FilePrecioUnitarioHeader;
    precioUnitarioDetalle: FilePrecioUnitarioCabecera[];
    
  }

  export interface WsResponseExcelPartidaVisualizarResponse {
    response: ExcelPartidaVisualizarResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }

  export class FilePrecioUnitarioHeader{
    idCodigo: number;
    codigoPresupuesto?: string;
    nombrePresupuesto?: string;
    subCodigoPresupuesto?: string;
    nombreSubPresupuesto?: string;
    fecha?: string;
    precioUnitarioCabecera: FilePrecioUnitarioCabecera[];
  }

  export class FilePrecioUnitarioCabecera{
    idCodigo: number;
    codigoPartida: string;
    nombrePartida: string;
    rendimiento: string;
    manoObra: string;
    equipo: string;
    costoUnitario: string;
    subTotalPartida: string;
    detallePrecioUnitario: FilePrecioUnitarioDetalle[];
  }

  export class FilePrecioUnitarioDetalle{
    idCodigo: number;
	codigoPartida: string;
	descripcionInsumo: string;
	categoriaInsumo: string;
	unidad: string;
	cuadrilla: string;
	cantidad: string;
	precio: string;
	parcial: string;
  }
  