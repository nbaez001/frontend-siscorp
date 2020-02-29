export interface PantallaAtenciones {
  total: number;
  ultimoModulo: number;
  modulos: PantallaModuloAtencion[];
}

export interface PantallaModuloAtencion {
  idModulo: number;
  entidad: string;
  encargado: string;
  logo: string;
  cantidadAtendidos: number;
  atendiendo: string;
  porAtender: string;
  listadoPorAtender?: string[];
  cantidadExtPorAtender: number;
}

