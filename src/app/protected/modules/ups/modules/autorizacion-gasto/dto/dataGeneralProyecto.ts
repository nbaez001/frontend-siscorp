export class DataGeneralProyecto{

	fidProyecto: number;
	tambo: string;
    nombreProyecto: string;
    coordinadorGeneralPlataforma: string;
	coordinadorRegionalPlataforma: string;
	supervisor: string;
    residente: string;
    nucleoEjecutor: string;
    presidente: string;
    tesorero: string;
    secretario: string;
    fiscal: string;
    avanceFisico: number;
    avanceFinanciero: number;

}

export interface WsResponseDataGeneralProyecto {
    response: DataGeneralProyecto[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  