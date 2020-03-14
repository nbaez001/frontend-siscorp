export class ResumenMovimiento{

    id: string;
    material: string;
    unidad: string;
    saldoAnterior: string;
    fechaIngreso: string;
    proveedor: string;
    cantidadIngreso: string;
    acumulado: string;
    fechaEgreso: string;
    partida: string;
    cantidadEgreso: string;
    saldo: number;

}


export interface WsResponseComprobante {
    response: ResumenMovimiento[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  