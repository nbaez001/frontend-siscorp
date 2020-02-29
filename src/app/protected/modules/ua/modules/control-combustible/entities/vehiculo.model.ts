import { Unidad } from './unidad.model';
import { Tambo } from './tambo.model';
import { Master } from './master.model';
import { RevisionTecnica } from './revision-tecnica.model';
import { SeguroSoat } from './seguro-soat.model';
import { InfraccionVehicular } from './infraccion-vehicular.model';

export class Vehiculo {
    id: number;
    idUnidad: number;
    unidad: string;
    idTambo: number;
    tambo: string;

    codPatrimonio: string;
    denominacion: string;
    marca: string;
    modelo: string;
    tipo: string;
    serie: string;
    placa: string;
    color: string;
    estado: string;

    idTipocombustible: number;
    nomTipocombustible: string;
    idEstado: number;
    nomEstado: string;
    fechaMantenimiento: Date;

    nombre: string;
}
