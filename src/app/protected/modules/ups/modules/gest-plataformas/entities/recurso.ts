export interface Recurso {
  id: number;
  nombre: string;
  idUt?: number;
  unidadTerritorial?: string;
}

export interface CondicionesTambos {
  idSituacion: number;
  situacion: string;
  idEstado: number;
  estado: string;
  idSubEstado: number;
  subEstado: string;
  idDetSubEstado: number;
  detSubEstado: string;
}
