export class DatoProfesional{
    codPersona:number;
    nombres: string;
    puesto: string;
    dni: string;
    profesion: number;
    celular: string;
    correo: string;
}


export interface WsResponseDatoProfesional {
    response: DatoProfesional[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }
  