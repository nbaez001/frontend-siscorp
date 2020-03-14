export class BandejaProyectoAutorizacionGasto{

            
            
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


export interface WsResponseBandejaProyectoAutorizacionGasto{
    response: BandejaProyectoAutorizacionGasto[];
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
  
  