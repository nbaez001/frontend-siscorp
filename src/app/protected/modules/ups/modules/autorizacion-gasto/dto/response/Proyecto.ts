export class Proyecto{

            codigo?: string;
            idCodigo?: string;
            item?: string;
            tiempoEjecucion?: string;
            fechaUtimaActualizacion?:string;
            supervisor?: string;
            cidEstado?: string;
            idEstado?: string;
            numPlazo?: string;
            color?: string;
            fidProyecto?: string;
            descripcionProyecto?: string;
            diasTranscurridos?: string;
            convenio?: string;
            avanceFin?: string;
            avanceFis?: string;
            fechaInicioEje?: string;
            fechaTerminoEje?: string;
            descripcion?:string;
            nroConvenio?:string;
            fecAutorizacion?:string;
            montoConvenio?:string;
            montoAcumulado?:string;
            saldoDisponible?:string;

}


export interface WsResponseProyecto {
    response: Proyecto[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }

  
export interface WsResponse {
    response: any[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  
  