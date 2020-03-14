export class TrabajadorPagoMensualRequest {
    idCodigo?: number;
    idCodigoPagoMensual?: number;
    nro?: number;
    idTipo: number;
    nombreApellido: string;
    concepto?: string;
    fecha?: string;
    autorizacionAnterior?: string;
    periodoAnio?: number;
    periodoMes?: number;
    diasDelMes?: number;
    diasAsistidos?: number;
    factor?: number;
    penalidad?: number;
    diasDeRetraso?: number;
    montoEjecucion?: number;
    avanceDelMes?: number;
    montoBruto?: number;
    penalidadFormula?: number;
    montoNeto?: number;
    observacion?: string;
}