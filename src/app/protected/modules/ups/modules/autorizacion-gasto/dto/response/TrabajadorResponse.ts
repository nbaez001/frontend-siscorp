export class TrabajadorResponse{

  idTrabajador?: string;
  tipoDocumento?: string;
  numDocumento?: string;
  apellidoPat?: string;
  apellidoMat?:string;
  nombres?: string;
  nombreCompleto?: string;
  genero?: string;
  fechaNacimiento?: string;
  edad?: string;
  departamentoNacimiento?: string;
  provinciaNacimiento?: string;
  distritoNacimiento?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  foto?: string;
  tipoTrabajador?: string;
  rutaContrato?:string;

}


export interface WsResponseTrabajador {
    response: TrabajadorResponse[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }

  
  