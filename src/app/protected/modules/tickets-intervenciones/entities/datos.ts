import { ModuloAtencion } from './modulo-atencion';
import { Genero } from './genero';
import { TipoDocumento } from './tipo-documento';
import { Persona } from './persona';
import { EstadoAtencion } from './estado-atencion';

export interface Datos {
  modulos?: ModuloAtencion[];
  generos?: Genero[];
  documentoTipos?: TipoDocumento[];
  estados?: EstadoAtencion[];
  persona?: Persona;
}
