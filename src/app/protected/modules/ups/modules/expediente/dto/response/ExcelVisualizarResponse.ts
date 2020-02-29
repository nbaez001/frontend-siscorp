  export class ExcelVisualizarResponse{  
    presupuestoCabecera: FilePresupuestoCabecera;
    presupuestoDetalle: FilePresupuestoDetalle[];
  }

  export interface WsResponseExcelVisualizarResponse {
    response: ExcelVisualizarResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }

  export class FilePresupuestoCabecera{
    codigoPresupuesto: string;
    nombreProyecto: string;
    cliente?: string;
    costo?: string;
    lugarProyecto?: string;
  }

  export class FilePresupuestoDetalle{
    codigoItem?: string;
    descripcion?: string;
    unidad?: string;
    metrado?: string;
    precio?: string;
    parcial?: string;
    color?: string;
    idPadre?: number;
    cantidadHijo?: number;
    nivel?: string;
    children?: FilePresupuestoDetalle[]
  }



