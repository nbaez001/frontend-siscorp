export interface ModuloAtencion {
  idModulo: number;
  idEntidad?: number;
  entidad: string;
  logo: string;
  pertenece: boolean;
  creaAtencion: boolean;
  idEncargado?: number;
  encargado: string;
  activo?: number;
}

export interface PostModuloAtencion {
  idModulo: number;
  idEntidad: number;
  nombreEntidad: string;
  logoEntidad: string;
  idUsuario: number;
  moduloActivo: number;
}
