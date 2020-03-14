export class DatoProyecto{
    idProyecto:number;
    tituloProy: string;
    subtituloProy: string;
   
    plazoEjecucion: string;
    avanceFisico: number;
    avanceFinanciero: string;
    montoFinanciero: string;
    montoRendido : string;
}


export interface WsResponseDatoProyecto {
    response: DatoProyecto[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  