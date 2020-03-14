export class BandejaProyectoGestionResponse{

            
            
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

            idProyecto?: String;
            nombreProyecto?: String;
            nombreTambo?: String;
            centroPoblado?: string;
            snip?: string;
            crp?: string;
            cgp?: string;
            codCrp?: string;
            codCgp?: string;
            nroCP?: string;
            nroPB?: string;
            estado?: string;
            montoViable?: string;
            ubigeo?: string;
            lugaer?: String;
            longitud?: String;
            latitud?: String;
            altitud?: String;
            
           
}


export interface WsBandejaProyectoGestionResponse{
    response: BandejaProyectoGestionResponse[];
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
  
  