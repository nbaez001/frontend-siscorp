  export class ExcelGeneralVisualizarResponse{  

    gastoGeneralCabecera: FileGastoGeneral;
    gastoGeneralDetalle: FileGastoGeneralDetalle[];
    
  }

  export interface WsResponseExcelGeneralVisualizarResponse {
    response: ExcelGeneralVisualizarResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }

  export class FileGastoGeneral{
    idCodigo: string;
    fechaExcel: string;
    plazoEjecucion: string;
    total: string;
  }

  export class FileGastoGeneralDetalle{
    numero: string;
    descripcion: string;
    unidad: string;
    cantidadUnidad: string;
    costoUnitario: string;
    coefPart: string;
    parcial: string;
    subTotal: string;
    total: string;
    idPadre?: number;
    cantidadHijo?: number;

  }
  