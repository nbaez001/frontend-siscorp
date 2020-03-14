export class Cronograma{

    DEC_METRADO: string;
    DEC_PARCIAL: string;
    DEC_PRECIO: string;
    DESCRIP_UND: string;
    FID_CRN_MENSUAL: string;
    ITEM: string;
    METRADO_1: string;
    METRADO_2: string;
    METRADO_3: string;
    METRADO_4: string;

    MONEDA_1: string;
    MONEDA_2: string;
    MONEDA_3: string;

    MONEDA_4: string;
    PORCENTAJE_1: string;
    PORCENTAJE_2: string;

    PORCENTAJE_3: string;
    PORCENTAJE_4: string;
    TXT_UNIDAD: string;

}


export interface WsResponseCronograma{
    response: Cronograma[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }