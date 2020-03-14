export class Comprobante{

    item: string;
    nroComprobante: string;
    rubro: string;
    tipoDocumento: string;
    nroDocumento: string;
    fechaDocumento: string;
    proveedor: string;
    rucDni: string;
    descripcion: string;
    importe: string;
    estado: string;
    fidProyecto: number;

}


export interface WsResponseComprobante {
    response: Comprobante[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  