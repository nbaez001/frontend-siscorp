export interface TicketAtencion {
  idAtencion: number;
  codigoAtencion: string;
  fechaRegistro: string;
  origen: string;
  entidad: string;
  encargado: string;
  creador: boolean;
  idPersona: number;
  personaAtendida: string;
  estadoCodigo: string;
  estadoNombre: string;
  cantidadArchivos: number;
}

export interface ResultadoIntervenciones {
  intervenciones: TicketAtencion[];
  total: number;
}
