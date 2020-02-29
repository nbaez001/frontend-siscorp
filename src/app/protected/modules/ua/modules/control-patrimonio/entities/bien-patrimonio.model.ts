import { Denominacion } from '../entities/denominacion.model';

export class BienPatrimonio {
    id: number;
    codPatrimonio: string;
    denominacion: Denominacion;

    estado: any;

    cuenta: any;
    fechaContabilidad: any;

    unidad: any;
    tambo: any;
    centroPoblado: any;
    distrito: any;
    provincia: any;
    departamento: any;

    nroDocAdquisicion: string;
    valorAdquisicion: number;


    marca: any;
    modelo: any;

    color: any[];
    cidSerie: string;
    txtMedida: string;
    anio: string;
    placa: string;
    chasis: string;
    motor: string;

    txtCaracteristica: string;
    txtObservacion: string;

    fechaRegistro: any;

    //OTROS
    coloresTabla: any[];
    unidadesTabla: any[];
    tambosTabla: any[];
    cuentasTabla: any[];
}