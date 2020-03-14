export class DatoProyecto{
    item?:string;
    codigo?:string;
    tambo?:string;
    convenio?:string;
    numPlazo?:string;
    fechaInicio?:string;
    ampliacionPlazo?:string;
    fechaFinProgramado?:string;
    diasTranscurridos?:string;
    avanceFisProgramado?:string; 
    avanceFisEjecutado?:string; 
    numPorcAvanze?:string;
    fecAutorizacion?:string;
    montoConvenio?:string;
    montoAcumulado?:string;
    saldoDisponible?:string;

    
}


export interface WsResponseDatoProyecto {
    response: DatoProyecto[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  