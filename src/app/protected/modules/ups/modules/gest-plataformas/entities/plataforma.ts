export interface Plataforma {
  idPlataforma: number;
  idCentroPoblado: number;
  centroPoblado: string;
  idUnidadTerritorial: number;
  unidadTerritorial: string;
  plataforma: string;
  numSNIP: number;
  codUnico: number;
  resolucion: string;
  idSituacion: number;
  situacion: string;
  idEstado: number;
  estado: string;
  idSubEstado: number;
  subEstado: string;
  idSSubEstado: number;
  ssubEstado: string;
  fecEjecucion: string;
  fecEntrega: string;
  fecPrestServ: string;
  latitud: string;
  longitud: string;
  altitud: string;
  prestaAtencion: boolean;
  activo: boolean;

  pFecReg: string;
  pFecAct: string;
  rFecReg: string;
  rFecAct: string;
}

export interface RespuestaPlataforma {
  plataformas: Plataforma[];
  total: number;
}

export interface DatosFormPlataforma {
  idPlataforma: number;
  nombre: string;
  snip: number;
  codUnico: string;
  longitud: string;
  latitud: string;
  altitud: string;
  resolucion: string;
  ssubEstado: number;
  fecEjecucion: string;
}
