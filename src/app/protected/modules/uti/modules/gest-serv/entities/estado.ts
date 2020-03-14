export interface Estado {
  idCodigo: number;
  nombre: string;
  color: string;
  codigo: string;
}

export interface EstadoActual {
  codEstadoServicio: string;
  colorEstadoServicio: string;
  estadoServicio: string;
  fecha: string;
  usuario: string;
  detalle: string;
}

export enum Servicios {
  internet = 'internet',
  telefonia = 'telefonia'
}

export interface Parametros {
  idServ: number;
  tipo: Servicios;
}
