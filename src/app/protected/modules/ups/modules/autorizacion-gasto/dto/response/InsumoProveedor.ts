export class InsumoProveedor{

            idCodigo: number;
            checked: boolean;
            nro: string;
            recurso: string;
            unidad: string;
            cantidad: string;
            marcaProv01?: string;
            precioUnitarioProv01?: string;
            subTotalProv01?: number;
            marcaProv02?: string;
            precioUnitarioProv02?: string;
            subTotalProv02?: string;
            marcaProv03?: string;
            precioUnitarioProv03?: string;
            subTotalProv03?: string;
            marcaProv04?: string;
            precioUnitarioProv04?: string;
            subTotalProv04?: string;
            cantidaProveedor?: number;

}


export interface WsResponseInsumoProveedor {
    response: InsumoProveedor[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }