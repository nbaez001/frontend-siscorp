export class Proyecto{

    item: string;
    codigo: string;
    nroConvenio: string;
    descripcion: string;
    tiempoEjecucion: string;
    fecInicioEjecucion: string;
    fecFinEjecucion: string;
    fecUltimaActualizacion: string;
    supervisor: string;
    estado: string;
    cidEstado: string;
    numPlazo: number;
    color: string;
    fecAutorizacion: string;
    montoConvenio: string;
    montoAcumulado: string;
    saldoDisponible: string;
    fidProyecto: number;

}


export interface WsResponseProyecto {
    response: Proyecto[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  