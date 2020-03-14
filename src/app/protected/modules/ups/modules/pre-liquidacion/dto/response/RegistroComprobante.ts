export class RegistroComprobante{
    checked:boolean;
    nro: string;
    recurso: string;
    unidadAu: string;
    cantidadAut: string;
    preUniAut: string;
    importeAut: string;
    proveedorAut: string;
    numAgAut: string;
    cantidadRen: string;
    precioUnitRen: string;
    importeRen: string;
    comprobanteRen: number;
    numComprobanteRen: string;
    cantidadDif: string;
    precioUnitDif: string;
    importeDif: string;
    observacion: string;
}

export interface WsResponseRegistroComprobante {
    response: RegistroComprobante[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  