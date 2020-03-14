export class ProyectoResponse{
     
    item: string;
    idCodigo: number;
    codigo?: string;
    fecRecepcion?: string;
    nombreCoordinador?: string;
    fecAsignacion?: string;
    fecAsignacionEncargado?: string;
    encargadoAsignado?: string;
    estado?: string;
    numPlazo?: number;
    cidModalidad?: string;
    flgElaboracion?: string;
    flgRevision?: string;
    color: string;
    cidEstado?: string;
    modalidad?:string;
    coordinadorPlataformaFija?:string;
    profesionalElaboracion?:string;
    profesionalRevision?:string;
    fidAusencia?:number;
    encargadoExpedienteTecnico?: string;
    fidProyecto: number;


}


export interface WsResponseProyecto {
    response: ProyectoResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  
