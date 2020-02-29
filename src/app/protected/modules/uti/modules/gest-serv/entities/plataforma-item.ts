import { Servicios } from './estado';

export interface PlataformaItem {
  idPlataforma: number;
  snipPlataforma: number;
  plataforma: string;
  unidadTerritorial: string;
  certificado: string;

  idServInt: number;
  tipoContrato: string;
  circuitoInt: string;
  fecInstalacion: string;
  porcentajeVel: number;
  idUnidadMedida: number;
  unidadMedida: string;
  velBajada: number;
  velSubida: number;
  velBajadaPorc: number;
  velSubidaPorc: number;
  mejorOperador: string;
  prioUAGS: number;
  codEstadoInternet: CodigoEstados;
  estadoInternet: string;

  idServTel: number;
  circuitoTel: string;
  anexo: string;
  telefono: string;
  codEstadoTelefonia: CodigoEstados;
  estadoTelefonia: string;
}

export interface PlatActEstado {
  idServicio: number;
  tipo: Servicios;
}

export enum CodigoEstados {
  OP = 'OP',
  IOP = 'IOP',
  CLIM = 'CLIM',
  OBS = 'OBS'
}
