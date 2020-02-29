export class RequerimientoBien {
    id: number;
    idUnidad: number;
    nomUnidad: string;
    asuntoRequerimiento: string;

    nroHojatramiteReq: string;
    nroInformeReq: string;

    idTipoAsigPresupuesto: number;
    nomTipoAsigPresupuesto: string;
    codAsigPresupuesto: string;
    importeAsigPresupuesto: number;

    idEstadoRequerimiento: number;
    nomEstadoRequerimiento: string;

    cotizacion: number;
    fecha: Date;

    conBadge: boolean;
}