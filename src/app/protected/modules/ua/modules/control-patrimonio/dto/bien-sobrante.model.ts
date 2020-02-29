import { Marca } from '../entities/marca.model';
import { Modelo } from '../entities/modelo.model';
import { Denominacion } from '../entities/denominacion.model';
import { Color } from '../entities/color.model';
import { Unidad } from '../../control-combustible/entities/unidad.model';
import { Tambo } from '../../control-combustible/entities/tambo.model';

export class BienSobrante {
    id: number;
    codigo: string;
    denominacion: Denominacion;

    marca: Marca;
    modelo: Modelo;
    cidSerie: string;
    txtMedida: string;

    estado: any;

    unidad: any;
    tambo: any;
    // centroPoblado: any;
    // distrito: any;
    // provincia: any;
    // departamento: any;


    color: Color[];

    anio: string;
    placa: string;
    chasis: string;
    motor: string;

    txtObservacion: string;
    txtCaracteristica: string;

    fechaRegistro: Date;


    //ADICIONAL
    coloresTabla: Color[];
    unidadesTabla: Unidad[];
    tambosTabla: Tambo[];
}