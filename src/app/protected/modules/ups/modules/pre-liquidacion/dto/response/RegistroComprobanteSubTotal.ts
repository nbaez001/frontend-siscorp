export class RegistroComprobanteSubTotal{
    descSub:string;
    importeAutSub: string;
    importeRenSub: string;
    importeDifSub: string;
    obsSub: string;
}

export interface WsResponseRegistroComprobanteSubTotal {
    response: RegistroComprobanteSubTotal[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  